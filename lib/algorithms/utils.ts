import { Cell, MazeGrid } from '../types';

export const getNeighbors = (grid: MazeGrid, cell: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  for (const [dx, dy] of directions) {
    const newX = cell.x + dx;
    const newY = cell.y + dy;

    if (
      newX >= 0 && newX < grid[0].length &&
      newY >= 0 && newY < grid.length &&
      !grid[newY][newX].isWall
    ) {
      neighbors.push({ ...grid[newY][newX] });
    }
  }

  return neighbors;
};

export const reconstructPath = (
  endCell: Cell,
  parentMap: Map<string, Cell>
): Cell[] => {
  const path: Cell[] = [];
  let current: Cell | undefined = endCell;

  while (current) {
    path.unshift(current);
    const parentKey = `${current.x},${current.y}`;
    current = parentMap.get(parentKey)?.parent;
  }

  return path;
};