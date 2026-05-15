"use client";

import { Box } from "@mui/material";
import { QueenStep } from "@/types/backtracking";

type Props = {
  board: number[][];
  currentStep: QueenStep | null;
};

export default function NQueensBoard({ board, currentStep }: Props) {
  const n = board.length;

  return (
    <Box sx={{ display: "grid", justifyContent: "center" }}>
      {board.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex" }}>
          {row.map((cell, colIndex) => {
            const isCurrent =
              currentStep?.row === rowIndex && currentStep?.col === colIndex;

            return (
              <Box
                key={`${rowIndex}-${colIndex}`}
                sx={{
                  width: Math.max(42, 420 / n),
                  height: Math.max(42, 420 / n),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                  bgcolor:
                    currentStep?.action === "solution"
                      ? "success.main"
                      : isCurrent
                      ? currentStep?.action === "remove"
                        ? "error.main"
                        : "warning.main"
                      : (rowIndex + colIndex) % 2 === 0
                      ? "grey.300"
                      : "grey.700",
                  color: cell === 1 ? "white" : "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {cell === 1 ? "♛" : ""}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}