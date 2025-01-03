import { Cell, MazeGrid } from '../types';
import { getNeighbors, reconstructPath } from './utils';

export const dfs = async (
  grid: MazeGrid,
  start: Cell,
  end: Cell,
  onVisit: (cell: Cell) => Promise<void>,
  animationSpeed: number
): Promise<Cell[]> => {
  const stack: Cell[] = [{ ...start, parent: undefined }];
  const visited = new Set<string>();
  const parentMap = new Map<string, Cell>();

  while (stack.length > 0) {
    const current = stack.pop()!;
    const key = `${current.x},${current.y}`;

    if (visited.has(key)) continue;
    
    visited.add(key);
    await onVisit(current);
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(current, parentMap);
    }

    for (const neighbor of getNeighbors(grid, current)) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(neighborKey)) {
        neighbor.parent = current;
        parentMap.set(neighborKey, neighbor);
        stack.push(neighbor);
      }
    }
  }

  return [];
};