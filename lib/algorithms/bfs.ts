import { Cell, MazeGrid } from '../types';
import { getNeighbors, reconstructPath } from './utils';

export const bfs = async (
  grid: MazeGrid,
  start: Cell,
  end: Cell,
  onVisit: (cell: Cell) => Promise<void>,
  animationSpeed: number
): Promise<Cell[]> => {
  const queue: Cell[] = [{ ...start, parent: undefined }];
  const visited = new Set<string>();
  const parentMap = new Map<string, Cell>();

  while (queue.length > 0) {
    const current = queue.shift()!;
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
        queue.push(neighbor);
      }
    }
  }

  return [];
};