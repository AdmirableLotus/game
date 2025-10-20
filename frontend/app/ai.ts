import { Cell, Line, Player } from './game';

export class AIPlayer {
  private playerId: number;
  private element: string;
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(playerId: number, element: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.playerId = playerId;
    this.element = element;
    this.difficulty = difficulty;
  }

  // Find best line to draw
  findBestLine(horizontalLines: Line[][], verticalLines: Line[][], grid: Cell[][]): { x: number; y: number; isHorizontal: boolean } | null {
    const availableLines: Array<{ x: number; y: number; isHorizontal: boolean; score: number }> = [];

    // Check horizontal lines
    horizontalLines.forEach((row, y) => {
      row.forEach((line, x) => {
        if (line.state === 'empty') {
          const score = this.evaluateLineMove(x, y, true, grid);
          availableLines.push({ x, y, isHorizontal: true, score });
        }
      });
    });

    // Check vertical lines
    verticalLines.forEach((row, y) => {
      row.forEach((line, x) => {
        if (line.state === 'empty') {
          const score = this.evaluateLineMove(x, y, false, grid);
          availableLines.push({ x, y, isHorizontal: false, score });
        }
      });
    });

    if (availableLines.length === 0) return null;

    // Sort by score and add some randomness based on difficulty
    availableLines.sort((a, b) => b.score - a.score);
    
    const randomness = this.difficulty === 'easy' ? 0.7 : this.difficulty === 'medium' ? 0.3 : 0.1;
    const topMoves = availableLines.slice(0, Math.max(1, Math.floor(availableLines.length * randomness)));
    
    return topMoves[Math.floor(Math.random() * topMoves.length)];
  }

  // Find best army move
  findBestArmyMove(grid: Cell[][]): { from: Cell; to: Cell } | null {
    const myTerritories = grid.flat().filter(cell => 
      cell.owner === this.playerId && cell.armyCount && cell.armyCount > 1
    );

    const possibleMoves: Array<{ from: Cell; to: Cell; score: number }> = [];

    myTerritories.forEach(fromCell => {
      const adjacent = this.getAdjacentCells(fromCell, grid);
      
      adjacent.forEach(toCell => {
        if (toCell.owner !== this.playerId) {
          const score = this.evaluateArmyMove(fromCell, toCell);
          possibleMoves.push({ from: fromCell, to: toCell, score });
        }
      });
    });

    if (possibleMoves.length === 0) return null;

    possibleMoves.sort((a, b) => b.score - a.score);
    return possibleMoves[0];
  }

  private evaluateLineMove(x: number, y: number, isHorizontal: boolean, grid: Cell[][]): number {
    let score = 1; // Base score

    // Check if this line completes any squares
    const squaresToCheck = isHorizontal
      ? [{ sx: x, sy: y - 1 }, { sx: x, sy: y }]
      : [{ sx: x - 1, sy: y }, { sx: x, sy: y }];

    squaresToCheck.forEach(({ sx, sy }) => {
      if (sx >= 0 && sx < grid[0].length && sy >= 0 && sy < grid.length) {
        if (this.wouldCompleteSquare(sx, sy, x, y, isHorizontal, grid)) {
          score += 10; // High priority for completing squares
        }
      }
    });

    return score;
  }

  private evaluateArmyMove(from: Cell, to: Cell): number {
    let score = 1;

    const attackPower = (from.armyCount || 0) - 1;
    const defensePower = to.armyCount || 1;

    // Prefer winnable battles
    if (attackPower > defensePower) {
      score += 5;
    }

    // Prefer attacking weaker territories
    score += Math.max(0, 3 - defensePower);

    return score;
  }

  private wouldCompleteSquare(sx: number, sy: number, lineX: number, lineY: number, isHorizontal: boolean, grid: Cell[][]): boolean {
    // Simplified check - would need full line state to be accurate
    return Math.random() < 0.3; // Placeholder logic
  }

  private getAdjacentCells(cell: Cell, grid: Cell[][]): Cell[] {
    const adjacent: Cell[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Wind element gets extended range
    if (this.element === 'wind') {
      directions.push([-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1], [-1, 1], [1, -1]);
    }

    directions.forEach(([dx, dy]) => {
      const nx = cell.x + dx;
      const ny = cell.y + dy;

      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
        adjacent.push(grid[ny][nx]);
      }
    });

    return adjacent;
  }
}