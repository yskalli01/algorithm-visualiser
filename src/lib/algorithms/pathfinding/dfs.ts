import { GridNode } from "@/types/pathfinding";

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function buildPath(start: GridNode, end: GridNode, found: boolean) {
  if (!found) return [];

  const path: GridNode[] = [];
  let current: GridNode | null = end;

  while (current !== null) {
    path.unshift(current);
    if (current.row === start.row && current.col === start.col) break;
    current = current.previousNode;
  }

  return path;
}

export function dfs(grid: GridNode[][], start: GridNode, end: GridNode) {
  const visitedOrder: GridNode[] = [];
  const stack: GridNode[] = [start];
  const visited = new Set<string>();
  let found = false;

  visited.add(`${start.row}-${start.col}`);

  while (stack.length > 0) {
    const current = stack.pop()!;
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      found = true;
      break;
    }

    for (const [dr, dc] of directions) {
      const row = current.row + dr;
      const col = current.col + dc;

      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
        continue;
      }

      const neighbor = grid[row][col];
      const key = `${row}-${col}`;

      if (visited.has(key) || neighbor.type === "wall") {
        continue;
      }

      visited.add(key);
      neighbor.previousNode = current;
      stack.push(neighbor);
    }
  }

  return { visitedOrder, path: buildPath(start, end, found) };
}
