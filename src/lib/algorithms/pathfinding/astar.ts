import { GridNode } from "@/types/pathfinding";

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function heuristic(a: GridNode, b: GridNode) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

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

export function astar(grid: GridNode[][], start: GridNode, end: GridNode) {
  const visitedOrder: GridNode[] = [];
  const openSet: GridNode[] = [start];
  const closedSet = new Set<string>();
  let found = false;

  start.distance = 0;

  const fScore = new Map<string, number>();
  fScore.set(`${start.row}-${start.col}`, heuristic(start, end));

  while (openSet.length > 0) {
    openSet.sort((a, b) => {
      const aScore = fScore.get(`${a.row}-${a.col}`) ?? Infinity;
      const bScore = fScore.get(`${b.row}-${b.col}`) ?? Infinity;
      return aScore - bScore;
    });

    const current = openSet.shift()!;
    const currentKey = `${current.row}-${current.col}`;

    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);
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
      const neighborKey = `${neighbor.row}-${neighbor.col}`;

      if (neighbor.type === "wall" || closedSet.has(neighborKey)) continue;

      const tentativeDistance = current.distance + 1;

      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = current;
        neighbor.distance = tentativeDistance;

        fScore.set(neighborKey, tentativeDistance + heuristic(neighbor, end));

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedOrder, path: buildPath(start, end, found) };
}
