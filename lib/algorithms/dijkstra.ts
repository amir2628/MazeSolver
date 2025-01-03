import { Cell, MazeGrid } from '../types';
import { getNeighbors, reconstructPath } from './utils';

export const dijkstra = async (
  grid: MazeGrid,
  start: Cell,
  end: Cell,
  onVisit: (cell: Cell) => Promise<void>,
  animationSpeed: number
): Promise<Cell[]> => {
  const distances = new Map<string, number>();
  const queue: Cell[] = [{ ...start, parent: undefined }];
  const visited = new Set<string>();
  const parentMap = new Map<string, Cell>();

  distances.set(`${start.x},${start.y}`, 0);

  while (queue.length > 0) {
    queue.sort((a, b) => {
      const distA = distances.get(`${a.x},${a.y}`) || Infinity;
      const distB = distances.get(`${b.x},${b.y}`) || Infinity;
      return distA - distB;
    });

    const current = queue.shift()!;
    const currentKey = `${current.x},${current.y}`;

    if (visited.has(currentKey)) continue;

    visited.add(currentKey);
    await onVisit(current);
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(current, parentMap);
    }

    const currentDistance = distances.get(currentKey) || Infinity;

    for (const neighbor of getNeighbors(grid, current)) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      const newDistance = currentDistance + 1;

      if (!distances.has(neighborKey) || newDistance < (distances.get(neighborKey) || Infinity)) {
        distances.set(neighborKey, newDistance);
        neighbor.parent = current;
        parentMap.set(neighborKey, neighbor);
        queue.push(neighbor);
      }
    }
  }

  return [];
};