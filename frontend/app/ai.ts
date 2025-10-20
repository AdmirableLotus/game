// Simple AI player for game
export class AIPlayer {
  constructor(public playerId: number, public element: string, public difficulty: string = 'medium') {}
  
  findBestLine(horizontalLines: any[][], verticalLines: any[][], grid: any[][]) {
    // Find all empty lines
    const emptyLines = [];
    
    // Check horizontal lines
    for (let y = 0; y < horizontalLines.length; y++) {
      for (let x = 0; x < horizontalLines[y].length; x++) {
        if (horizontalLines[y][x].state === 'empty') {
          emptyLines.push({ x, y, isHorizontal: true });
        }
      }
    }
    
    // Check vertical lines
    for (let y = 0; y < verticalLines.length; y++) {
      for (let x = 0; x < verticalLines[y].length; x++) {
        if (verticalLines[y][x].state === 'empty') {
          emptyLines.push({ x, y, isHorizontal: false });
        }
      }
    }
    
    // Return random empty line
    if (emptyLines.length > 0) {
      return emptyLines[Math.floor(Math.random() * emptyLines.length)];
    }
    return null;
  }
  
  findBestArmyMove(grid: any[][]) {
    // Find all AI territories with armies > 1
    const myTerritories = [];
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        if (cell.owner === this.playerId && cell.armyCount > 1) {
          myTerritories.push(cell);
        }
      }
    }
    
    // Find valid moves
    for (const territory of myTerritories) {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      
      for (const [dx, dy] of directions) {
        const nx = territory.x + dx;
        const ny = territory.y + dy;
        
        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
          const targetCell = grid[ny][nx];
          if (!targetCell.owner || targetCell.owner !== this.playerId) {
            return { from: territory, to: targetCell };
          }
        }
      }
    }
    
    return null;
  }
}