"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Algorithm, Cell, MazeGrid } from '@/lib/types';
import { generateMaze } from '@/lib/mazeGenerator';
import { bfs, dfs, aStar, dijkstra } from '@/lib/algorithms';
import { Wand2, Play, Gauge } from 'lucide-react';

const MAZE_SIZE = 31;
const MIN_SPEED = 5;
const MAX_SPEED = 200;
const DEFAULT_SPEED = 50;

export default function Home() {
  const [maze, setMaze] = useState<MazeGrid>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>("BFS");
  const [isSolving, setIsSolving] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_SPEED);

  useEffect(() => {
    generateNewMaze();
  }, []);

  const generateNewMaze = () => {
    const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE);
    setMaze(newMaze);
    setIsSolving(false);
  };

  const resetMaze = useCallback(() => {
    if (!maze.length) return;
    
    setMaze(prevMaze => prevMaze.map(row => 
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
        isLeading: false,
        parent: undefined,
        f: undefined,
        g: undefined,
        h: undefined,
      }))
    ));
  }, [maze]);

  const solveMaze = async () => {
    if (!maze.length || isSolving) return;
    
    setIsSolving(true);
    resetMaze();

    const start = maze[1][1];
    const end = maze[MAZE_SIZE-2][MAZE_SIZE-2];

    const onVisit = async (cell: Cell) => {
      setMaze(prev => prev.map(row => 
        row.map(c => ({
          ...c,
          isVisited: c.x === cell.x && c.y === cell.y ? true : c.isVisited,
          isLeading: c.x === cell.x && c.y === cell.y,
        }))
      ));
    };

    try {
      let path: Cell[] = [];
      const speed = MAX_SPEED - animationSpeed + MIN_SPEED;

      switch (algorithm) {
        case "BFS":
          path = await bfs(maze, start, end, onVisit, speed);
          break;
        case "DFS":
          path = await dfs(maze, start, end, onVisit, speed);
          break;
        case "A*":
          path = await aStar(maze, start, end, onVisit, speed);
          break;
        case "Dijkstra":
          path = await dijkstra(maze, start, end, onVisit, speed);
          break;
      }

      // Highlight the solution path
      if (path.length > 0) {
        for (const cell of path) {
          setMaze(prev => prev.map(row => 
            row.map(c => ({
              ...c,
              isPath: c.x === cell.x && c.y === cell.y ? true : c.isPath,
              isLeading: c.x === cell.x && c.y === cell.y,
            }))
          ));
          await new Promise(resolve => setTimeout(resolve, speed / 2));
        }
      }
    } catch (error) {
      console.error('Error solving maze:', error);
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Intelligent Maze Solver
          </h1>
          <p className="text-gray-400">
            Watch different algorithms solve complex mazes in real-time
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <Button
              onClick={generateNewMaze}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate New Maze
            </Button>

            <Select
              value={algorithm}
              onValueChange={(value) => setAlgorithm(value as Algorithm)}
            >
              <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BFS">Breadth-First Search</SelectItem>
                <SelectItem value="DFS">Depth-First Search</SelectItem>
                <SelectItem value="A*">A* Search</SelectItem>
                <SelectItem value="Dijkstra">Dijkstra's Algorithm</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={solveMaze}
              disabled={!maze.length || isSolving}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Play className="mr-2 h-4 w-4" />
              Solve Maze
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full max-w-md">
            <Gauge className="h-4 w-4 text-gray-400" />
            <Slider
              value={[animationSpeed]}
              onValueChange={([value]) => setAnimationSpeed(value)}
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 w-20">
              Speed: {Math.round((animationSpeed / MAX_SPEED) * 100)}%
            </span>
          </div>
        </div>

        <div className="relative aspect-square max-w-3xl mx-auto bg-gray-800 rounded-lg p-4 shadow-xl">
          <div 
            className="grid h-full gap-[1px] bg-gray-700 rounded overflow-hidden"
            style={{ 
              gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)`,
              width: '100%',
              aspectRatio: '1/1'
            }}
          >
{maze.map((row, y) =>
  row.map((cell, x) => (
    <div
      key={`${x}-${y}`}
      className={`
        transition-all duration-200
        ${cell.isWall ? 'bg-gray-900' : 'bg-gray-800'}
        ${(x === 1 && y === 1) ? '!bg-blue-500' : ''} 
        ${(x === MAZE_SIZE-2 && y === MAZE_SIZE-2) ? '!bg-red-500' : ''}
        ${cell.isPath && !cell.isWall && !(x === 1 && y === 1) && !(x === MAZE_SIZE-2 && y === MAZE_SIZE-2) ? '!bg-green-500 shadow-lg shadow-green-500/50' : ''}
        ${cell.isVisited && !cell.isWall && !cell.isPath ? 'bg-purple-900/50' : ''}
        ${cell.isLeading && !cell.isWall ? 'animate-pulse bg-yellow-400' : ''}
      `}
    />
  ))
)}

          </div>
        </div>
      </div>
    </div>
  );
}