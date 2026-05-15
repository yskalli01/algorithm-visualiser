import { MazeCell, MazeStep } from "@/types/backtracking";

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function cloneMaze(maze: MazeCell[][]) {
  return maze.map((row) => row.map((cell) => ({ ...cell })));
}

export function mazeSolverSteps(maze: MazeCell[][]): MazeStep[] {
  const steps: MazeStep[] = [];
  const visited = new Set<string>();

  const start = maze.flat().find((cell) => cell.type === "start");
  const end = maze.flat().find((cell) => cell.type === "end");

  if (!start || !end) return steps;

  const endRow = end.row;
  const endCol = end.col;

  function solve(row: number, col: number): boolean {
    const key = `${row}-${col}`;

    if (
      row < 0 ||
      row >= maze.length ||
      col < 0 ||
      col >= maze[0].length ||
      visited.has(key) ||
      maze[row][col].type === "wall"
    ) {
      return false;
    }

    visited.add(key);

    if (maze[row][col].type !== "start" && maze[row][col].type !== "end") {
      maze[row][col].type = "visited";
    }

    steps.push({
      maze: cloneMaze(maze),
      row,
      col,
      action: "visit",
    });

    if (row === endRow && col === endCol) {
      steps.push({
        maze: cloneMaze(maze),
        row,
        col,
        action: "solution",
      });

      return true;
    }

    for (const [dr, dc] of directions) {
      if (solve(row + dr, col + dc)) {
        if (maze[row][col].type !== "start" && maze[row][col].type !== "end") {
          maze[row][col].type = "path";
        }

        steps.push({
          maze: cloneMaze(maze),
          row,
          col,
          action: "path",
        });

        return true;
      }
    }

    if (maze[row][col].type !== "start" && maze[row][col].type !== "end") {
      maze[row][col].type = "empty";
    }

    steps.push({
      maze: cloneMaze(maze),
      row,
      col,
      action: "backtrack",
    });

    return false;
  }

  solve(start.row, start.col);

  return steps;
}