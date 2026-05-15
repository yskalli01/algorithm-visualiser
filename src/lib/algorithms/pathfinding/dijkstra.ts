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

export function dijkstra(grid: GridNode[][], start: GridNode, end: GridNode) {
  const visitedOrder: GridNode[] = [];
  const unvisitedNodes = grid.flat();
  let found = false;

  start.distance = 0;

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);

    const current = unvisitedNodes.shift()!;

    if (current.type === "wall") continue;
    if (current.distance === Infinity) break;

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

      if (neighbor.type === "wall") continue;

      const newDistance = current.distance + 1;

      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.previousNode = current;
      }
    }
  }

  return { visitedOrder, path: buildPath(start, end, found) };
}
