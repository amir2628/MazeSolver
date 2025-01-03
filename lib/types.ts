export type Cell = {
  x: number;
  y: number;
  isWall: boolean;
  isVisited?: boolean;
  isPath?: boolean;
  isLeading?: boolean;
  parent?: Cell;
  f?: number; // for A*
  g?: number; // for A*
  h?: number; // for A*
};

export type MazeGrid = Cell[][];

export type Algorithm = 
  | "BFS"
  | "DFS"
  | "A*"
  | "Bellman-Ford"
  | "Floyd-Warshall"
  | "Recursive Backtracking"
  | "Greedy Best-First"
  | "Bidirectional"
  | "Lee"
  | "Random Walk"
  | "Simulated Annealing"
  | "Genetic"
  | "Ant Colony"
  | "Flood Fill"
  | "Johnson";