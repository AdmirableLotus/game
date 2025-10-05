import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Element = 'fire' | 'water' | 'earth' | 'wind';
type CellState = 'empty' | 'claimed' | 'army';
type LineState = 'empty' | 'drawn' | 'selected';

interface Cell {
  id: string;
  x: number;
  y: number;
  state: CellState;
  owner?: number;
  armyCount?: number;
  element?: Element;
}

interface Line {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  state: LineState;
  owner?: number;
}

interface Player {
  id: number;
  element: Element;
  color: string;
  isAI: boolean;
  territories: number;
  armies: number;
}

export default function Game() {
  const params = useLocalSearchParams();
  const { element, mode, mapSize, playerCount } = params;

  const getGridSize = (size: string) => {
    switch (size) {
      case 'small': return 8;
      case 'large': return 12;
      default: return 10;
    }
  };

  const gridSize = getGridSize(mapSize as string);
  const cellSize = Math.min((screenWidth - 80) / (gridSize + 1), 30);
  
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gamePhase, setGamePhase] = useState<'drawing' | 'army'>('drawing');
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [horizontalLines, setHorizontalLines] = useState<Line[][]>([]);
  const [verticalLines, setVerticalLines] = useState<Line[][]>([]);
  
  const playerColors = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0'];
  const playerElements: Element[] = ['fire', 'water', 'earth', 'wind'];
  
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Initialize players
    const newPlayers: Player[] = [];
    for (let i = 0; i < parseInt(playerCount as string); i++) {
      newPlayers.push({
        id: i,
        element: i === 0 ? (element as Element) : playerElements[i],
        color: playerColors[i],
        isAI: mode === 'local' && i > 0,
        territories: 0,
        armies: 3,
      });
    }
    setPlayers(newPlayers);

    // Initialize grid
    const newGrid: Cell[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          id: `${x}-${y}`,
          x,
          y,
          state: 'empty',
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);

    // Initialize horizontal lines
    const newHorizontalLines: Line[][] = [];
    for (let y = 0; y <= gridSize; y++) {
      const row: Line[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          id: `h-${x}-${y}`,
          from: { x, y },
          to: { x: x + 1, y },
          state: 'empty',
        });
      }
      newHorizontalLines.push(row);
    }
    setHorizontalLines(newHorizontalLines);

    // Initialize vertical lines
    const newVerticalLines: Line[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: Line[] = [];
      for (let x = 0; x <= gridSize; x++) {
        row.push({
          id: `v-${x}-${y}`,
          from: { x, y },
          to: { x, y: y + 1 },
          state: 'empty',
        });
      }
      newVerticalLines.push(row);
    }
    setVerticalLines(newVerticalLines);
  };

  const handleLinePress = (lineId: string, isHorizontal: boolean, x: number, y: number) => {
    if (gamePhase !== 'drawing') return;

    // Draw line
    if (isHorizontal) {
      const newLines = [...horizontalLines];
      if (newLines[y] && newLines[y][x] && newLines[y][x].state === 'empty') {
        newLines[y][x] = {
          ...newLines[y][x],
          state: 'drawn',
          owner: currentPlayer,
        };
        setHorizontalLines(newLines);
        
        // Check for completed squares
        checkCompletedSquares(x, y, true);
        nextTurn();
      }
    } else {
      const newLines = [...verticalLines];
      if (newLines[y] && newLines[y][x] && newLines[y][x].state === 'empty') {
        newLines[y][x] = {
          ...newLines[y][x],
          state: 'drawn',
          owner: currentPlayer,
        };
        setVerticalLines(newLines);
        
        // Check for completed squares
        checkCompletedSquares(x, y, false);
        nextTurn();
      }
    }
  };

  const checkCompletedSquares = (x: number, y: number, isHorizontal: boolean) => {
    const newGrid = [...grid];
    let squaresClaimed = 0;

    // Check squares that could be completed by this line
    const squaresToCheck = isHorizontal
      ? [{ sx: x, sy: y - 1 }, { sx: x, sy: y }]
      : [{ sx: x - 1, sy: y }, { sx: x, sy: y }];

    squaresToCheck.forEach(({ sx, sy }) => {
      if (sx >= 0 && sx < gridSize && sy >= 0 && sy < gridSize) {
        if (isSquareComplete(sx, sy)) {
          if (newGrid[sy][sx].state === 'empty') {
            newGrid[sy][sx] = {
              ...newGrid[sy][sx],
              state: 'claimed',
              owner: currentPlayer,
              element: players[currentPlayer]?.element,
              armyCount: 1,
            };
            squaresClaimed++;
          }
        }
      }
    });

    if (squaresClaimed > 0) {
      setGrid(newGrid);
      // Update player territories
      const newPlayers = [...players];
      newPlayers[currentPlayer].territories += squaresClaimed;
      setPlayers(newPlayers);
    }
  };

  const isSquareComplete = (x: number, y: number): boolean => {
    // Check all four sides of the square
    const topLine = horizontalLines[y]?.[x];
    const bottomLine = horizontalLines[y + 1]?.[x];
    const leftLine = verticalLines[y]?.[x];
    const rightLine = verticalLines[y]?.[x + 1];

    return (
      topLine?.state === 'drawn' &&
      bottomLine?.state === 'drawn' &&
      leftLine?.state === 'drawn' &&
      rightLine?.state === 'drawn'
    );
  };

  const nextTurn = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const handleCellPress = (cell: Cell) => {
    if (gamePhase !== 'army' || cell.owner !== currentPlayer) return;
    
    if (selectedCell === cell.id) {
      setSelectedCell(null);
    } else {
      setSelectedCell(cell.id);
    }
  };

  const toggleGamePhase = () => {
    setGamePhase(gamePhase === 'drawing' ? 'army' : 'drawing');
    setSelectedCell(null);
  };

  const handleBack = () => {
    router.back();
  };

  const renderDot = (x: number, y: number) => {
    return (
      <View
        key={`dot-${x}-${y}`}
        style={[
          styles.dot,
          {
            left: x * cellSize,
            top: y * cellSize,
          },
        ]}
      />
    );
  };

  const renderHorizontalLine = (line: Line, x: number, y: number) => {
    return (
      <TouchableOpacity
        key={line.id}
        style={[
          styles.horizontalLine,
          {
            left: x * cellSize + 4,
            top: y * cellSize - 2,
            width: cellSize - 8,
            backgroundColor: line.state === 'drawn' 
              ? (line.owner !== undefined ? players[line.owner]?.color : '#64ffda') 
              : 'transparent',
            borderColor: line.state === 'empty' ? '#ffffff30' : 'transparent',
          },
        ]}
        onPress={() => handleLinePress(line.id, true, x, y)}
        disabled={line.state !== 'empty' || gamePhase !== 'drawing'}
      />
    );
  };

  const renderVerticalLine = (line: Line, x: number, y: number) => {
    return (
      <TouchableOpacity
        key={line.id}
        style={[
          styles.verticalLine,
          {
            left: x * cellSize - 2,
            top: y * cellSize + 4,
            height: cellSize - 8,
            backgroundColor: line.state === 'drawn' 
              ? (line.owner !== undefined ? players[line.owner]?.color : '#64ffda') 
              : 'transparent',
            borderColor: line.state === 'empty' ? '#ffffff30' : 'transparent',
          },
        ]}
        onPress={() => handleLinePress(line.id, false, x, y)}
        disabled={line.state !== 'empty' || gamePhase !== 'drawing'}
      />
    );
  };

  const renderCell = (cell: Cell) => {
    const isSelected = selectedCell === cell.id;
    
    return (
      <TouchableOpacity
        key={cell.id}
        style={[
          styles.cell,
          {
            left: cell.x * cellSize + 4,
            top: cell.y * cellSize + 4,
            width: cellSize - 8,
            height: cellSize - 8,
            backgroundColor: cell.state === 'claimed' && cell.owner !== undefined
              ? players[cell.owner]?.color + '40'
              : 'transparent',
            borderColor: isSelected ? '#64ffda' : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          },
        ]}
        onPress={() => handleCellPress(cell)}
        disabled={cell.state !== 'claimed' || gamePhase !== 'army'}
      >
        {cell.armyCount && cell.armyCount > 0 && (
          <Text style={[
            styles.armyText,
            { color: cell.owner !== undefined ? players[cell.owner]?.color : '#fff' }
          ]}>
            {cell.armyCount}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.gameInfo}>
            <Text style={styles.currentPlayerText}>
              {players[currentPlayer]?.element.toUpperCase()} TURN
            </Text>
            <View style={[
              styles.currentPlayerIndicator,
              { backgroundColor: players[currentPlayer]?.color }
            ]} />
          </View>
        </View>

        {/* Game Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.phaseButton,
              gamePhase === 'drawing' && styles.activePhase
            ]}
            onPress={toggleGamePhase}
          >
            <Text style={[
              styles.phaseText,
              gamePhase === 'drawing' && styles.activePhaseText
            ]}>
              Draw Lines
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.phaseButton,
              gamePhase === 'army' && styles.activePhase
            ]}
            onPress={toggleGamePhase}
          >
            <Text style={[
              styles.phaseText,
              gamePhase === 'army' && styles.activePhaseText
            ]}>
              Move Armies
            </Text>
          </TouchableOpacity>
        </View>

        {/* Game Board */}
        <View style={styles.gameBoard}>
          <View style={[
            styles.gridContainer,
            {
              width: (gridSize + 1) * cellSize,
              height: (gridSize + 1) * cellSize,
            }
          ]}>
            {/* Dots */}
            {Array.from({ length: gridSize + 1 }).map((_, y) =>
              Array.from({ length: gridSize + 1 }).map((_, x) => renderDot(x, y))
            )}

            {/* Horizontal Lines */}
            {horizontalLines.map((row, y) =>
              row.map((line, x) => renderHorizontalLine(line, x, y))
            )}

            {/* Vertical Lines */}
            {verticalLines.map((row, y) =>
              row.map((line, x) => renderVerticalLine(line, x, y))
            )}

            {/* Cells */}
            {grid.map((row) =>
              row.map((cell) => renderCell(cell))
            )}
          </View>
        </View>

        {/* Player Status */}
        <View style={styles.playerStatus}>
          {players.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={[styles.playerColor, { backgroundColor: player.color }]} />
              <Text style={styles.playerName}>{player.element}</Text>
              <Text style={styles.playerStats}>
                Territories: {player.territories}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#64ffda',
    fontWeight: '600',
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentPlayerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  currentPlayerIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  phaseButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#ffffff20',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  activePhase: {
    backgroundColor: '#64ffda20',
    borderColor: '#64ffda',
  },
  phaseText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  activePhaseText: {
    color: '#64ffda',
  },
  gameBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gridContainer: {
    position: 'relative',
    backgroundColor: '#ffffff05',
    borderRadius: 8,
    padding: 20,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff60',
  },
  horizontalLine: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
  },
  verticalLine: {
    position: 'absolute',
    width: 4,
    borderRadius: 2,
    borderWidth: 1,
  },
  cell: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  armyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerStatus: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  playerCard: {
    flex: 1,
    backgroundColor: '#ffffff10',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  playerColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  playerStats: {
    fontSize: 10,
    color: '#b0bec5',
  },
});