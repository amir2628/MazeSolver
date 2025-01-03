import { Cell, MazeGrid } from './types';

export const generateMaze = (width: number, height: number): MazeGrid => {
  // Initialize grid with walls
  const grid: MazeGrid = Array(height).fill(null).map((_, y) =>
    Array(width).fill(null).map((_, x) => ({
      x,
      y,
      isWall: true,
    }))
  );

  const recursiveBacktrack = (x: number, y: number) => {
    grid[y][x].isWall = false;

    // Define possible directions (up, right, down, left)
    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 && newX < width &&
        newY >= 0 && newY < height &&
        grid[newY][newX].isWall
      ) {
        // Carve path by making the wall and the cell beyond it passages
        grid[y + dy/2][x + dx/2].isWall = false;
        recursiveBacktrack(newX, newY);
      }
    }
  };

  // Start from a random point
  recursiveBacktrack(1, 1);

  // Set start and end points
  grid[1][1].isWall = false;
  grid[height-2][width-2].isWall = false;

  return grid;
};