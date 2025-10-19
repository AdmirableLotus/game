import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
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
  const [gameWinner, setGameWinner] = useState<number | null>(null);
  const [turnAnimation] = useState(new Animated.Value(0));
  const [captureAnimation] = useState(new Animated.Value(0));
  
  const playerColors = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0'];
  const playerElements: Element[] = ['fire', 'water', 'earth', 'wind'];
  
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
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

  const findCellById = (cellId: string): Cell | null => {
    for (const row of grid) {
      for (const cell of row) {
        if (cell.id === cellId) return cell;
      }
    }
    return null;
  };

  const isAdjacent = (cell1: Cell, cell2: Cell): boolean => {
    const dx = Math.abs(cell1.x - cell2.x);
    const dy = Math.abs(cell1.y - cell2.y);
    
    // Wind elemental ability: can move 2 spaces
    if (cell1.element === 'wind') {
      return (dx <= 2 && dy === 0) || (dx === 0 && dy <= 2) || (dx === 1 && dy === 1);
    }
    
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  const executeArmyMove = (fromCell: Cell, toCell: Cell) => {
    const newGrid = [...grid];
    const fromGridCell = newGrid[fromCell.y][fromCell.x];
    const toGridCell = newGrid[toCell.y][toCell.x];
    const playerElement = players[currentPlayer].element;
    
    let attackingArmies = fromGridCell.armyCount! - 1;
    
    // Wind elemental ability: +1 army strength in attacks
    if (playerElement === 'wind') {
      attackingArmies += 1;
    }
    
    if (toCell.owner === undefined || toCell.owner === currentPlayer) {
      toGridCell.owner = currentPlayer;
      toGridCell.state = 'claimed';
      toGridCell.element = playerElement;
      toGridCell.armyCount = (toGridCell.armyCount || 0) + attackingArmies;
      fromGridCell.armyCount = 1;
      
      // Fire elemental ability: spread to adjacent neutral territories
      if (playerElement === 'fire') {
        spreadFire(newGrid, toCell.x, toCell.y);
      }
    } else {
      let defendingArmies = toGridCell.armyCount || 1;
      
      // Water elemental ability: +1 defense bonus
      if (toGridCell.element === 'water') {
        defendingArmies += 1;
      }
      
      if (attackingArmies > defendingArmies) {
        const newPlayers = [...players];
        newPlayers[toCell.owner].territories--;
        newPlayers[currentPlayer].territories++;
        
        toGridCell.owner = currentPlayer;
        toGridCell.element = playerElement;
        toGridCell.armyCount = attackingArmies - defendingArmies;
        fromGridCell.armyCount = 1;
        
        setPlayers(newPlayers);
        animateCapture();
        
        // Fire elemental ability: spread after conquest
        if (playerElement === 'fire') {
          spreadFire(newGrid, toCell.x, toCell.y);
        }
      } else {
        toGridCell.armyCount = defendingArmies - attackingArmies;
        fromGridCell.armyCount = 1;
      }
    }
    
    setGrid(newGrid);
    checkWinCondition();
    nextTurn();
  };

  const spreadFire = (grid: Cell[][], x: number, y: number) => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        const cell = grid[ny][nx];
        if (cell.state === 'empty') {
          // Convert neutral territory to fire territory
          cell.state = 'claimed';
          cell.owner = currentPlayer;
          cell.element = 'fire';
          cell.armyCount = 1;
          
          const newPlayers = [...players];
          newPlayers[currentPlayer].territories++;
          setPlayers(newPlayers);
        }
      }
    });
  };

  const animateCapture = () => {
    Animated.sequence([
      Animated.timing(captureAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(captureAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkWinCondition = () => {
    const totalTerritories = gridSize * gridSize;
    const winThreshold = Math.floor(totalTerritories * 0.6);
    
    for (const player of players) {
      if (player.territories >= winThreshold) {
        setGameWinner(player.id);
        setTimeout(() => {
          router.push({
            pathname: '/victory',
            params: {
              winner: player.id,
              element: player.element
            }
          });
        }, 1000);
        return;
      }
    }
  };

  const handleLinePress = (lineId: string, isHorizontal: boolean, x: number, y: number) => {
    if (gamePhase !== 'drawing') return;

    if (isHorizontal) {
      const newLines = [...horizontalLines];
      if (newLines[y] && newLines[y][x] && newLines[y][x].state === 'empty') {
        newLines[y][x] = {
          ...newLines[y][x],
          state: 'drawn',
          owner: currentPlayer,
        };
        setHorizontalLines(newLines);
        
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
        
        checkCompletedSquares(x, y, false);
        nextTurn();
      }
    }
  };

  const checkCompletedSquares = (x: number, y: number, isHorizontal: boolean) => {
    const newGrid = [...grid];
    let squaresClaimed = 0;

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
      const newPlayers = [...players];
      newPlayers[currentPlayer].territories += squaresClaimed;
      setPlayers(newPlayers);
      
      animateCapture();
      checkWinCondition();
    }
  };

  const isSquareComplete = (x: number, y: number): boolean => {
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
    if (gameWinner) return;
    
    Animated.sequence([
      Animated.timing(turnAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(turnAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setCurrentPlayer((prev) => (prev + 1) % players.length);
    
    const newPlayers = [...players];
    const nextPlayer = (currentPlayer + 1) % players.length;
    const nextPlayerElement = newPlayers[nextPlayer].element;
    
    // Base army generation
    newPlayers[nextPlayer].armies += Math.max(1, Math.floor(newPlayers[nextPlayer].territories / 3));
    
    const newGrid = [...grid];
    
    // Earth elemental ability: regenerate lost territories
    if (nextPlayerElement === 'earth') {
      regenerateEarth(newGrid, nextPlayer);
    }
    
    // Add armies to territories
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (newGrid[y][x].owner === nextPlayer && newGrid[y][x].state === 'claimed') {
          let armyBonus = 1;
          
          // Water elemental ability: extra fortification
          if (nextPlayerElement === 'water') {
            armyBonus = 2;
          }
          
          newGrid[y][x].armyCount = (newGrid[y][x].armyCount || 0) + armyBonus;
        }
      }
    }
    
    setGrid(newGrid);
    setPlayers(newPlayers);
  };

  const regenerateEarth = (grid: Cell[][], playerId: number) => {
    const earthTerritories = [];
    
    // Find all earth territories
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x].owner === playerId && grid[y][x].element === 'earth') {
          earthTerritories.push({ x, y });
        }
      }
    }
    
    // Try to regenerate one adjacent empty territory per earth territory
    earthTerritories.forEach(({ x, y }) => {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          const cell = grid[ny][nx];
          if (cell.state === 'empty' && Math.random() < 0.3) { // 30% chance
            cell.state = 'claimed';
            cell.owner = playerId;
            cell.element = 'earth';
            cell.armyCount = 1;
            
            const newPlayers = [...players];
            newPlayers[playerId].territories++;
            setPlayers(newPlayers);
            break; // Only regenerate one per territory
          }
        }
      }
    });
  };

  const handleCellPress = (cell: Cell) => {
    if (gamePhase !== 'army') return;
    
    if (selectedCell && selectedCell !== cell.id) {
      const fromCell = findCellById(selectedCell);
      if (fromCell && isAdjacent(fromCell, cell) && fromCell.armyCount! > 1) {
        executeArmyMove(fromCell, cell);
        setSelectedCell(null);
        return;
      }
    }
    
    if (cell.owner !== currentPlayer) return;
    
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
    const canAttack = selectedCell && selectedCell !== cell.id && gamePhase === 'army';
    const fromCell = selectedCell ? findCellById(selectedCell) : null;
    const isTargetable = canAttack && fromCell && isAdjacent(fromCell, cell);
    
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
            borderColor: isSelected ? '#64ffda' : isTargetable ? '#ff6b6b' : 'transparent',
            borderWidth: (isSelected || isTargetable) ? 2 : 0,
          },
        ]}
        onPress={() => handleCellPress(cell)}
        disabled={gamePhase !== 'army'}
      >
        {cell.armyCount && cell.armyCount > 0 && (
          <Text style={[
            styles.armyText,
            { color: cell.owner !== undefined ? players[cell.owner]?.color : '#fff' }
          ]}>
            {cell.armyCount}
          </Text>
        )}
        {cell.element && (
          <Text style={styles.elementIcon}>
            {cell.element === 'fire' ? '🔥' : 
             cell.element === 'water' ? '💧' : 
             cell.element === 'earth' ? '🌱' : '💨'}
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
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <Animated.View style={[
            styles.gameInfo,
            {
              transform: [{
                scale: turnAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                })
              }]
            }
          ]}>
            <Text style={styles.currentPlayerText}>
              {players[currentPlayer]?.element.toUpperCase()} TURN
            </Text>
            <View style={[
              styles.currentPlayerIndicator,
              { backgroundColor: players[currentPlayer]?.color }
            ]} />
          </Animated.View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.phaseButton,
              gamePhase === 'drawing' && styles.activePhase
            ]}
            onPress={toggleGamePhase}
            disabled={gameWinner !== null}
          >
            <Text style={[
              styles.phaseText,
              gamePhase === 'drawing' && styles.activePhaseText
            ]}>
              🔗 Claim Territory
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.phaseButton,
              gamePhase === 'army' && styles.activePhase
            ]}
            onPress={toggleGamePhase}
            disabled={gameWinner !== null}
          >
            <Text style={[
              styles.phaseText,
              gamePhase === 'army' && styles.activePhaseText
            ]}>
              ⚔️ Command Armies
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gameBoard}>
          <Animated.View style={[
            styles.gridContainer,
            {
              width: (gridSize + 1) * cellSize,
              height: (gridSize + 1) * cellSize,
              transform: [{
                scale: captureAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })
              }]
            }
          ]}>
            {Array.from({ length: gridSize + 1 }).map((_, y) =>
              Array.from({ length: gridSize + 1 }).map((_, x) => renderDot(x, y))
            )}

            {horizontalLines.map((row, y) =>
              row.map((line, x) => renderHorizontalLine(line, x, y))
            )}

            {verticalLines.map((row, y) =>
              row.map((line, x) => renderVerticalLine(line, x, y))
            )}

            {grid.map((row) =>
              row.map((cell) => renderCell(cell))
            )}
          </Animated.View>
        </View>

        <View style={styles.playerStatus}>
          {players.map((player) => {
            const isWinner = gameWinner === player.id;
            const dominancePercent = Math.floor((player.territories / (gridSize * gridSize)) * 100);
            const abilityText = {
              fire: '🔥 Spreads',
              water: '🛡️ Fortifies', 
              earth: '🌱 Regenerates',
              wind: '🌪️ Extended Range'
            };
            
            return (
              <View key={player.id} style={[
                styles.playerCard,
                isWinner && styles.winnerCard,
                player.id === currentPlayer && styles.currentPlayerCard
              ]}>
                <View style={[
                  styles.playerColor, 
                  { backgroundColor: player.color },
                  isWinner && styles.winnerGlow
                ]} />
                <Text style={[
                  styles.playerName,
                  isWinner && styles.winnerText
                ]}>
                  {player.element} {isWinner ? '👑' : ''}
                </Text>
                <Text style={styles.playerAbility}>
                  {abilityText[player.element]}
                </Text>
                <Text style={styles.playerStats}>
                  {dominancePercent}% controlled
                </Text>
              </View>
            );
          })}
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
  winnerCard: {
    borderColor: '#ffd700',
    borderWidth: 2,
    backgroundColor: '#ffd70020',
  },
  currentPlayerCard: {
    borderColor: '#64ffda',
    borderWidth: 1,
  },
  winnerGlow: {
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  winnerText: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  elementIcon: {
    fontSize: 8,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  playerAbility: {
    fontSize: 9,
    color: '#64ffda',
    fontWeight: '500',
    marginBottom: 2,
  },
});