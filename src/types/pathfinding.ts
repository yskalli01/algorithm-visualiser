export type NodeType = "empty" | "start" | "end" | "wall" | "visited" | "path";

export type GridNode = {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  previousNode: GridNode | null;
};

// export type GraphNode = {
//     row: number;
//     col: number;
//     isStart?: boolean;
//     isEnd?: boolean;
//     isWall?: boolean;
//     isVisited?: boolean;
//     isPath?: boolean;
//     distance?: number;
//     previousNode?: GraphNode | null;
//   };
  
// export type GraphStep = {
//     grid: GraphNode[][];
//     current?: {
//       row: number;
//       col: number;
//     };
//   };