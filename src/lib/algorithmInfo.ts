export type AlgorithmInfo = {
  name: string;
  time: string;
  space: string;
  stable?: string;
  optimal?: string;
  recursive?: string;
  description: string;
  howItWorks?: string;
  pseudocode?: string;
  useCases?: readonly string[];
};

export const sortingInfo = {
  bubble: {
    name: "Bubble Sort",
    time: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    recursive: "No",
    description: "Repeatedly compares adjacent values and swaps them when they are out of order.",
    howItWorks: "Bubble Sort repeatedly walks through the array, compares neighboring values, and moves the largest remaining value toward the end after each pass.",
    pseudocode: "repeat until sorted:\n  for each adjacent pair:\n    if left > right:\n      swap them",
    useCases: ["Teaching comparisons and swaps", "Small arrays", "Nearly sorted data demos"],
  },
  selection: {
    name: "Selection Sort",
    time: "O(n²)",
    space: "O(1)",
    stable: "No",
    recursive: "No",
    description: "Finds the smallest remaining value and moves it into the next sorted position.",
    howItWorks: "Selection Sort scans the unsorted part, selects the minimum value, and places it at the next sorted index.",
    pseudocode: "for i from 0 to n - 1:\n  min = i\n  for j from i + 1 to n:\n    if arr[j] < arr[min]:\n      min = j\n  swap arr[i] and arr[min]",
    useCases: ["Teaching selection logic", "When writes should be limited", "Small arrays"],
  },
  insertion: {
    name: "Insertion Sort",
    time: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    recursive: "No",
    description: "Builds a sorted section by inserting each value into its correct position.",
    howItWorks: "Insertion Sort grows a sorted left side by taking the next value and shifting larger values right until the correct position opens.",
    pseudocode: "for i from 1 to n - 1:\n  key = arr[i]\n  move larger values right\n  insert key",
    useCases: ["Nearly sorted arrays", "Small datasets", "Teaching online sorting"],
  },
  merge: {
    name: "Merge Sort",
    time: "O(n log n)",
    space: "O(n)",
    stable: "Yes",
    recursive: "Yes",
    description: "Splits the array, sorts each half, then merges the sorted halves back together.",
    howItWorks: "Merge Sort divides the array into halves until single elements remain, then merges the halves back in sorted order.",
    pseudocode: "mergeSort(array):\n  split array in half\n  mergeSort(left)\n  mergeSort(right)\n  merge sorted halves",
    useCases: ["Stable sorting", "Large datasets", "Linked-list sorting"],
  },
  quick: {
    name: "Quick Sort",
    time: "Average O(n log n), worst O(n²)",
    space: "O(log n)",
    stable: "No",
    recursive: "Yes",
    description: "Chooses a pivot, partitions values around it, then recursively sorts both sides.",
    howItWorks: "Quick Sort chooses a pivot, moves smaller values to one side and larger values to the other, then repeats on each partition.",
    pseudocode: "quickSort(array):\n  choose pivot\n  partition around pivot\n  quickSort(left)\n  quickSort(right)",
    useCases: ["Fast average-case sorting", "In-place sorting", "General-purpose sorting demos"],
  },
} as const;

export const pathfindingInfo = {
  bfs: {
    name: "Breadth-First Search",
    time: "O(V + E)",
    space: "O(V)",
    optimal: "Yes, when every move has the same cost",
    recursive: "No",
    description: "Explores the grid layer by layer, so it finds the shortest path in an unweighted grid.",
    howItWorks: "BFS uses a queue. It visits all nodes one move away, then two moves away, and continues layer by layer until it reaches the end.",
    pseudocode: "queue = [start]\nmark start visited\nwhile queue not empty:\n  current = queue.shift()\n  if current is end: stop\n  add unvisited neighbors",
    useCases: ["Shortest path in unweighted grids", "Level-order traversal", "Finding minimum number of moves"],
  },
  dfs: {
    name: "Depth-First Search",
    time: "O(V + E)",
    space: "O(V)",
    optimal: "No",
    recursive: "No, this implementation uses a stack",
    description: "Explores as far as possible in one direction before backtracking to try another route.",
    howItWorks: "DFS uses a stack. It follows one branch deeply before returning to try another possible branch.",
    pseudocode: "stack = [start]\nwhile stack not empty:\n  current = stack.pop()\n  if current is end: stop\n  push unvisited neighbors",
    useCases: ["Exploring reachable areas", "Maze-style traversal", "Teaching backtracking behavior"],
  },
  dijkstra: {
    name: "Dijkstra",
    time: "O(V²) in this simple grid implementation",
    space: "O(V)",
    optimal: "Yes, with non-negative edge weights",
    recursive: "No",
    description: "Always expands the known node with the smallest distance from the start.",
    howItWorks: "Dijkstra keeps the best known distance to every node and repeatedly expands the unvisited node with the smallest distance.",
    pseudocode: "distance[start] = 0\nwhile unvisited nodes remain:\n  current = node with smallest distance\n  relax each neighbor\n  update better distances",
    useCases: ["Weighted shortest paths", "Maps and networks", "Routing problems"],
  },
  astar: {
    name: "A* Search",
    time: "O(E) to O(V²), depending on the heuristic and grid",
    space: "O(V)",
    optimal: "Yes, with an admissible heuristic",
    recursive: "No",
    description: "Combines distance from the start with an estimated distance to the goal.",
    howItWorks: "A* scores nodes with cost so far plus a heuristic estimate to the end, usually reaching the goal faster than Dijkstra on grids.",
    pseudocode: "openSet = [start]\nwhile openSet not empty:\n  current = lowest fScore\n  if current is end: stop\n  update neighbors using gScore + heuristic",
    useCases: ["Game pathfinding", "Maps", "Grid navigation with a target"],
  },
} as const;

export const backtrackingInfo = {
  nqueens: {
    name: "N-Queens",
    time: "O(n!)",
    space: "O(n²)",
    recursive: "Yes",
    optimal: "Finds a valid solution, not an optimization problem",
    description:
      "Places queens row by row and backtracks whenever a queen attacks another queen.",
    howItWorks:
      "The solver tries to place one queen per row. If a queen conflicts with an existing queen, it tries the next column. If no column works, it removes the previous queen and backtracks.",
    pseudocode: `solve(row):
  if row == n: solution found

  for each col:
    if safe(row, col):
      place queen
      solve(row + 1)
      remove queen`,
    useCases: [
      "Teaching recursion",
      "Constraint satisfaction",
      "Backtracking demos",
    ],
  },

  maze: {
    name: "Maze Solver",
    time: "O(rows × cols)",
    space: "O(rows × cols)",
    recursive: "Yes",
    optimal: "No, DFS does not guarantee shortest path",
    description:
      "Uses depth-first search with backtracking to find any valid route from start to end.",
    howItWorks:
      "The solver visits a cell, recursively tries each direction, and marks dead ends by backtracking when a route cannot reach the end.",
    pseudocode: `solve(cell):
  if cell is wall or visited:
    return false

  mark visited

  if cell is end:
    return true

  for each direction:
    if solve(next cell):
      mark path
      return true

  backtrack
  return false`,
    useCases: [
      "Maze solving",
      "Teaching DFS",
      "Showing recursive backtracking",
    ],
  },
} as const;
