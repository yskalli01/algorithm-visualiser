import { QueenStep } from "@/types/backtracking";

function isSafe(board: number[][], row: number, col: number, n: number) {
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 1) return false;
  }

  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return false;
  }

  for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 1) return false;
  }

  return true;
}

export function nQueensSteps(n: number): QueenStep[] {
  const board = Array.from({ length: n }, () => Array(n).fill(0));
  const steps: QueenStep[] = [];

  function solve(row: number): boolean {
    if (row === n) {
      steps.push({
        board: board.map((r) => [...r]),
        row: -1,
        col: -1,
        action: "solution",
      });

      return true;
    }

    for (let col = 0; col < n; col++) {
      steps.push({
        board: board.map((r) => [...r]),
        row,
        col,
        action: "check",
      });

      if (isSafe(board, row, col, n)) {
        board[row][col] = 1;

        steps.push({
          board: board.map((r) => [...r]),
          row,
          col,
          action: "place",
        });

        if (solve(row + 1)) return true;

        board[row][col] = 0;

        steps.push({
          board: board.map((r) => [...r]),
          row,
          col,
          action: "remove",
        });
      }
    }

    return false;
  }

  solve(0);

  return steps;
}