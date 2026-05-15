export type QueenStep = {
    board: number[][];
    row: number;
    col: number;
    action: "place" | "remove" | "check" | "solution";
};



export type MazeCell = {
    row: number;
    col: number;
    type: "empty" | "wall" | "start" | "end" | "visited" | "path";
};
  
export type MazeStep = {
    maze: MazeCell[][];
    row: number;
    col: number;
    action: "visit" | "path" | "backtrack" | "solution";
};