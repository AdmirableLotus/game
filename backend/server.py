from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Game Models
class Player(BaseModel):
    id: int
    element: str
    color: str
    is_ai: bool
    territories: int = 0
    armies: int = 3

class GameState(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_code: Optional[str] = None
    players: List[Player]
    current_player: int = 0
    game_phase: str = "drawing"  # "drawing" or "army"
    map_size: str = "medium"
    grid: List[List[Dict[str, Any]]] = []
    horizontal_lines: List[List[Dict[str, Any]]] = []
    vertical_lines: List[List[Dict[str, Any]]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    game_status: str = "active"  # "waiting", "active", "finished"

class GameMove(BaseModel):
    game_id: str
    player_id: int
    move_type: str  # "line", "army_move"
    data: Dict[str, Any]

class CreateGameRequest(BaseModel):
    element: str
    mode: str
    map_size: str
    player_count: int

class JoinGameRequest(BaseModel):
    room_code: str
    element: str

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str


# Game Logic Functions
def initialize_grid(size: str):
    """Initialize game grid based on map size"""
    grid_size = {'small': 8, 'medium': 10, 'large': 12}.get(size, 10)
    
    # Initialize cells
    grid = []
    for y in range(grid_size):
        row = []
        for x in range(grid_size):
            row.append({
                'id': f'{x}-{y}',
                'x': x,
                'y': y,
                'state': 'empty',
                'owner': None,
                'army_count': 0,
                'element': None
            })
        grid.append(row)
    
    # Initialize horizontal lines
    horizontal_lines = []
    for y in range(grid_size + 1):
        row = []
        for x in range(grid_size):
            row.append({
                'id': f'h-{x}-{y}',
                'from': {'x': x, 'y': y},
                'to': {'x': x + 1, 'y': y},
                'state': 'empty',
                'owner': None
            })
        horizontal_lines.append(row)
    
    # Initialize vertical lines
    vertical_lines = []
    for y in range(grid_size):
        row = []
        for x in range(grid_size + 1):
            row.append({
                'id': f'v-{x}-{y}',
                'from': {'x': x, 'y': y},
                'to': {'x': x, 'y': y + 1},
                'state': 'empty',
                'owner': None
            })
        vertical_lines.append(row)
    
    return grid, horizontal_lines, vertical_lines

def generate_room_code():
    """Generate a 6-character room code"""
    import random
    import string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


# API Routes
@api_router.get("/")
async def root():
    return {"message": "Elemental Conquest API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/games", response_model=GameState)
async def create_game(request: CreateGameRequest):
    """Create a new game"""
    # Initialize players
    player_colors = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0']
    player_elements = ['fire', 'water', 'earth', 'wind']
    
    players = []
    for i in range(request.player_count):
        element = request.element if i == 0 else player_elements[i]
        players.append(Player(
            id=i,
            element=element,
            color=player_colors[i],
            is_ai=request.mode == 'local' and i > 0
        ))
    
    # Initialize game board
    grid, horizontal_lines, vertical_lines = initialize_grid(request.map_size)
    
    # Create game state
    game_state = GameState(
        room_code=generate_room_code() if request.mode == 'online' else None,
        players=players,
        map_size=request.map_size,
        grid=grid,
        horizontal_lines=horizontal_lines,
        vertical_lines=vertical_lines,
        game_status="waiting" if request.mode == 'online' else "active"
    )
    
    # Save to database
    await db.games.insert_one(game_state.dict())
    return game_state

@api_router.get("/games/{game_id}", response_model=GameState)
async def get_game(game_id: str):
    """Get game state by ID"""
    game = await db.games.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return GameState(**game)

@api_router.get("/games/room/{room_code}", response_model=GameState)
async def get_game_by_room(room_code: str):
    """Get game state by room code"""
    game = await db.games.find_one({"room_code": room_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game room not found")
    return GameState(**game)

@api_router.post("/games/{game_id}/join")
async def join_game(game_id: str, request: JoinGameRequest):
    """Join an existing game"""
    game = await db.games.find_one({"room_code": request.room_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game room not found")
    
    game_state = GameState(**game)
    
    # Check if game is full
    if len(game_state.players) >= 4:
        raise HTTPException(status_code=400, detail="Game is full")
    
    # Add new player
    player_colors = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0']
    new_player = Player(
        id=len(game_state.players),
        element=request.element,
        color=player_colors[len(game_state.players)],
        is_ai=False
    )
    game_state.players.append(new_player)
    
    # Start game if we have enough players
    if len(game_state.players) >= 2:
        game_state.game_status = "active"
    
    # Update in database
    game_state.updated_at = datetime.utcnow()
    await db.games.replace_one({"id": game_id}, game_state.dict())
    
    return {"message": "Joined game successfully", "game_id": game_id}

@api_router.post("/games/{game_id}/move")
async def make_move(game_id: str, move: GameMove):
    """Make a move in the game"""
    game = await db.games.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game_state = GameState(**game)
    
    # Validate move
    if game_state.current_player != move.player_id:
        raise HTTPException(status_code=400, detail="Not your turn")
    
    if move.move_type == "line":
        # Process line drawing move
        line_data = move.data
        is_horizontal = line_data.get("is_horizontal", True)
        x, y = line_data.get("x", 0), line_data.get("y", 0)
        
        if is_horizontal:
            if y < len(game_state.horizontal_lines) and x < len(game_state.horizontal_lines[y]):
                line = game_state.horizontal_lines[y][x]
                if line.get("state") == "empty":
                    game_state.horizontal_lines[y][x]["state"] = "drawn"
                    game_state.horizontal_lines[y][x]["owner"] = move.player_id
        else:
            if y < len(game_state.vertical_lines) and x < len(game_state.vertical_lines[y]):
                line = game_state.vertical_lines[y][x]
                if line.get("state") == "empty":
                    game_state.vertical_lines[y][x]["state"] = "drawn"
                    game_state.vertical_lines[y][x]["owner"] = move.player_id
        
        # Check for completed squares and update territories
        # (This is a simplified version - full implementation would check all affected squares)
        
        # Next player's turn
        game_state.current_player = (game_state.current_player + 1) % len(game_state.players)
    
    elif move.move_type == "army_move":
        # Process army movement
        # Implementation for army movement logic
        pass
    
    # Update game state
    game_state.updated_at = datetime.utcnow()
    await db.games.replace_one({"id": game_id}, game_state.dict())
    
    return {"message": "Move processed successfully"}

@api_router.get("/games/{game_id}/status")
async def get_game_status(game_id: str):
    """Get current game status for real-time updates"""
    game = await db.games.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game_state = GameState(**game)
    return {
        "current_player": game_state.current_player,
        "game_phase": game_state.game_phase,
        "game_status": game_state.game_status,
        "players": [{"element": p.element, "territories": p.territories} for p in game_state.players],
        "updated_at": game_state.updated_at
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()