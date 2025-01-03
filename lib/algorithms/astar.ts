import { Cell, MazeGrid } from '../types';
import { getNeighbors, reconstructPath } from './utils';

export const aStar = async (
  grid: MazeGrid,
  start: Cell,
  end: Cell,
  onVisit: (cell: Cell) => Promise<void>,
  animationSpeed: number
): Promise<Cell[]> => {
  const openSet: Cell[] = [{ ...start, g: 0, h: 0, f: 0, parent: undefined }];
  const closedSet = new Set<string>();
  const parentMap = new Map<string, Cell>();

  const heuristic = (a: Cell, b: Cell) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  while (openSet.length > 0) {
    openSet.sort((a, b) => (a.f || 0) - (b.f || 0));
    const current = openSet.shift()!;
    const currentKey = `${current.x},${current.y}`;
    
    await onVisit(current);
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(current, parentMap);
    }

    closedSet.add(currentKey);

    for (const neighbor of getNeighbors(grid, current)) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (closedSet.has(neighborKey)) continue;

      const gScore = (current.g || 0) + 1;
      const hScore = heuristic(neighbor, end);
      const fScore = gScore + hScore;

      neighbor.g = gScore;
      neighbor.h = hScore;
      neighbor.f = fScore;
      neighbor.parent = current;

      const existingOpenNode = openSet.find(
        node => node.x === neighbor.x && node.y === neighbor.y
      );

      if (!existingOpenNode) {
        openSet.push(neighbor);
        parentMap.set(neighborKey, neighbor);
      } else if (gScore < (existingOpenNode.g || 0)) {
        existingOpenNode.g = gScore;
        existingOpenNode.f = fScore;
        existingOpenNode.parent = current;
        parentMap.set(neighborKey, existingOpenNode);
      }
    }
  }

  return [];
};