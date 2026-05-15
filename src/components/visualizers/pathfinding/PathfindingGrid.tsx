"use client";

import { Box } from "@mui/material";
import { GridNode } from "@/types/pathfinding";

type Props = {
  grid: GridNode[][];
  onNodeMouseDown: (row: number, col: number) => void;
  onNodeMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
};

export default function PathfindingGrid({
  grid,
  onNodeMouseDown,
  onNodeMouseEnter,
  onMouseUp,
}: Props) {
  return (
    <Box sx={{ display: "grid", gap: "2px", justifyContent: "center", userSelect: "none" }} onMouseLeave={onMouseUp} onMouseUp={onMouseUp}>
      {grid.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", gap: "2px" }}>
          {row.map((node) => (
            <Box
              key={`${node.row}-${node.col}`}
              onMouseDown={() => onNodeMouseDown(node.row, node.col)}
              onMouseEnter={() => onNodeMouseEnter(node.row, node.col)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "4px",
                cursor: node.type === "start" || node.type === "end" ? "grab" : "pointer",
                transition: "transform 120ms ease, background-color 120ms ease",
                transform: node.type === "start" || node.type === "end" ? "scale(1.08)" : "scale(1)",
                bgcolor:
                  node.type === "start"
                    ? "success.main"
                    : node.type === "end"
                    ? "error.main"
                    : node.type === "wall"
                    ? "grey.900"
                    : node.type === "visited"
                    ? "info.main"
                    : node.type === "path"
                    ? "warning.main"
                    : "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
