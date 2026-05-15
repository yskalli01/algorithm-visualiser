"use client";

import { Box } from "@mui/material";
import { MazeCell } from "@/types/backtracking";
import Legend from "@/components/common/Legend";

type Props = {
  maze: MazeCell[][];
  onCellClick: (row: number, col: number) => void;
};

export default function MazeBoard({ maze, onCellClick }: Props) {
  return (
    <Box sx={{ display: "grid", justifyContent: "center", gap: "2px" }}>
      <Legend
        items={[
            { label: "Start", color: "#2e7d32" },
            { label: "End", color: "#d32f2f" },
            { label: "Wall", color: "#212121" },
            { label: "Visited", color: "#0288d1" },
            { label: "Path", color: "#ed6c02" },
        ]}
        />
      {maze.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", gap: "2px" }}>
          {row.map((cell) => (
            <Box
              key={`${cell.row}-${cell.col}`}
              onClick={() => onCellClick(cell.row, cell.col)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "4px",
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                bgcolor:
                  cell.type === "start"
                    ? "success.main"
                    : cell.type === "end"
                    ? "error.main"
                    : cell.type === "wall"
                    ? "grey.900"
                    : cell.type === "visited"
                    ? "info.main"
                    : cell.type === "path"
                    ? "warning.main"
                    : "background.paper",
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}