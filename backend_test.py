#!/usr/bin/env python3
"""
Backend API Testing for Elemental Conquest Game
Tests all game API endpoints including game creation, moves, and status
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('EXPO_PUBLIC_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return None
    return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_BASE}")

class GameTester:
    def __init__(self):
        self.session = requests.Session()
        self.game_id = None
        self.room_code = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {details}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
        
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Elemental Conquest" in data["message"]:
                    self.log_test("Health Check", True, f"Response: {data['message']}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_create_local_game(self):
        """Test creating a local game"""
        try:
            game_data = {
                "element": "fire",
                "mode": "local",
                "map_size": "medium",
                "player_count": 2
            }
            
            response = self.session.post(f"{API_BASE}/games", json=game_data)
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ['id', 'players', 'grid', 'horizontal_lines', 'vertical_lines']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Create Local Game", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Store game ID for further tests
                self.game_id = data['id']
                
                # Validate players
                if len(data['players']) != 2:
                    self.log_test("Create Local Game", False, f"Expected 2 players, got {len(data['players'])}")
                    return False
                
                # Check first player element
                if data['players'][0]['element'] != 'fire':
                    self.log_test("Create Local Game", False, f"First player element should be 'fire', got '{data['players'][0]['element']}'")
                    return False
                
                # Check game status
                if data['game_status'] != 'active':
                    self.log_test("Create Local Game", False, f"Local game should be 'active', got '{data['game_status']}'")
                    return False
                
                self.log_test("Create Local Game", True, f"Game created with ID: {self.game_id}")
                return True
            else:
                self.log_test("Create Local Game", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Local Game", False, f"Exception: {str(e)}")
            return False
    
    def test_create_online_game(self):
        """Test creating an online game"""
        try:
            game_data = {
                "element": "water",
                "mode": "online",
                "map_size": "medium",
                "player_count": 2
            }
            
            response = self.session.post(f"{API_BASE}/games", json=game_data)
            if response.status_code == 200:
                data = response.json()
                
                # Check room code exists for online game
                if not data.get('room_code'):
                    self.log_test("Create Online Game", False, "Online game should have room_code")
                    return False
                
                # Store room code for further tests
                self.room_code = data['room_code']
                
                # Check game status is waiting
                if data['game_status'] != 'waiting':
                    self.log_test("Create Online Game", False, f"Online game should be 'waiting', got '{data['game_status']}'")
                    return False
                
                self.log_test("Create Online Game", True, f"Online game created with room code: {self.room_code}")
                return True
            else:
                self.log_test("Create Online Game", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Online Game", False, f"Exception: {str(e)}")
            return False
    
    def test_get_game_by_id(self):
        """Test retrieving game by ID"""
        if not self.game_id:
            self.log_test("Get Game by ID", False, "No game ID available")
            return False
            
        try:
            response = self.session.get(f"{API_BASE}/games/{self.game_id}")
            if response.status_code == 200:
                data = response.json()
                if data['id'] == self.game_id:
                    self.log_test("Get Game by ID", True, f"Retrieved game {self.game_id}")
                    return True
                else:
                    self.log_test("Get Game by ID", False, f"ID mismatch: expected {self.game_id}, got {data['id']}")
                    return False
            else:
                self.log_test("Get Game by ID", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Game by ID", False, f"Exception: {str(e)}")
            return False
    
    def test_get_game_by_room_code(self):
        """Test retrieving game by room code"""
        if not self.room_code:
            self.log_test("Get Game by Room Code", False, "No room code available")
            return False
            
        try:
            response = self.session.get(f"{API_BASE}/games/room/{self.room_code}")
            if response.status_code == 200:
                data = response.json()
                if data['room_code'] == self.room_code:
                    self.log_test("Get Game by Room Code", True, f"Retrieved game with room code {self.room_code}")
                    return True
                else:
                    self.log_test("Get Game by Room Code", False, f"Room code mismatch")
                    return False
            else:
                self.log_test("Get Game by Room Code", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Game by Room Code", False, f"Exception: {str(e)}")
            return False
    
    def test_game_status(self):
        """Test getting game status"""
        if not self.game_id:
            self.log_test("Get Game Status", False, "No game ID available")
            return False
            
        try:
            response = self.session.get(f"{API_BASE}/games/{self.game_id}/status")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['current_player', 'game_phase', 'game_status', 'players']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Get Game Status", False, f"Missing fields: {missing_fields}")
                    return False
                
                self.log_test("Get Game Status", True, f"Status: {data['game_status']}, Current player: {data['current_player']}")
                return True
            else:
                self.log_test("Get Game Status", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Get Game Status", False, f"Exception: {str(e)}")
            return False
    
    def test_make_move(self):
        """Test making a line drawing move"""
        if not self.game_id:
            self.log_test("Make Move", False, "No game ID available")
            return False
            
        try:
            move_data = {
                "game_id": self.game_id,
                "player_id": 0,
                "move_type": "line",
                "data": {
                    "is_horizontal": True,
                    "x": 0,
                    "y": 0
                }
            }
            
            response = self.session.post(f"{API_BASE}/games/{self.game_id}/move", json=move_data)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "processed" in data["message"].lower():
                    self.log_test("Make Move", True, f"Move processed: {data['message']}")
                    return True
                else:
                    self.log_test("Make Move", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Make Move", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Make Move", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_move(self):
        """Test making an invalid move (wrong player turn)"""
        if not self.game_id:
            self.log_test("Invalid Move Test", False, "No game ID available")
            return False
            
        try:
            # Try to make a move with wrong player (should be player 1's turn after previous move)
            move_data = {
                "game_id": self.game_id,
                "player_id": 0,  # Should be player 1's turn now
                "move_type": "line",
                "data": {
                    "is_horizontal": True,
                    "x": 1,
                    "y": 0
                }
            }
            
            response = self.session.post(f"{API_BASE}/games/{self.game_id}/move", json=move_data)
            if response.status_code == 400:
                self.log_test("Invalid Move Test", True, "Correctly rejected invalid move")
                return True
            else:
                self.log_test("Invalid Move Test", False, f"Should have rejected move, got status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Invalid Move Test", False, f"Exception: {str(e)}")
            return False
    
    def test_join_game(self):
        """Test joining an online game"""
        if not self.room_code:
            self.log_test("Join Game", False, "No room code available")
            return False
            
        try:
            # First get the game ID from room code
            response = self.session.get(f"{API_BASE}/games/room/{self.room_code}")
            if response.status_code != 200:
                self.log_test("Join Game", False, "Could not get game by room code")
                return False
                
            game_data = response.json()
            online_game_id = game_data['id']
            
            join_data = {
                "room_code": self.room_code,
                "element": "earth"
            }
            
            response = self.session.post(f"{API_BASE}/games/{online_game_id}/join", json=join_data)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "joined" in data["message"].lower():
                    self.log_test("Join Game", True, f"Successfully joined game: {data['message']}")
                    return True
                else:
                    self.log_test("Join Game", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Join Game", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Join Game", False, f"Exception: {str(e)}")
            return False
    
    def test_nonexistent_game(self):
        """Test accessing non-existent game"""
        try:
            fake_id = "nonexistent-game-id"
            response = self.session.get(f"{API_BASE}/games/{fake_id}")
            if response.status_code == 404:
                self.log_test("Non-existent Game Test", True, "Correctly returned 404 for non-existent game")
                return True
            else:
                self.log_test("Non-existent Game Test", False, f"Expected 404, got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Non-existent Game Test", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Elemental Conquest Backend API Tests")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_health_check,
            self.test_create_local_game,
            self.test_get_game_by_id,
            self.test_game_status,
            self.test_make_move,
            self.test_invalid_move,
            self.test_create_online_game,
            self.test_get_game_by_room_code,
            self.test_join_game,
            self.test_nonexistent_game
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print()  # Add spacing between tests
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend API is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
            return False

def main():
    """Main test runner"""
    tester = GameTester()
    success = tester.run_all_tests()
    
    # Print summary for easy parsing
    print("\n" + "=" * 60)
    print("SUMMARY:")
    for result in tester.test_results:
        status = "PASS" if result['success'] else "FAIL"
        print(f"{status}: {result['test']}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())