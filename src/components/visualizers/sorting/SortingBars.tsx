"use client";

import { Box } from "@mui/material";
import { motion } from "motion/react";

type Props = {
  array: number[];
  comparing?: [number, number];
  swapped?: [number, number];
  finished?: boolean;
};

export default function SortingBars({
  array,
  comparing,
  swapped,
  finished
}: Props) {
  return (
    <Box
      sx={{
        height: 340,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 1,
        mt: 4,
        p: 2,
      }}
    >
      {array.map((value, index) => {
        const isComparing = comparing?.includes(index);
        const isSwapped = swapped?.includes(index);

        return (
          <motion.div
            key={index}
            layout
            animate={{
              height: value,
              scale: isComparing ? 1.08 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
            }}
            style={{
              width: `${Math.max(8, 700 / array.length)}px`,
              borderRadius: 8,
              backgroundColor: finished
                ? "#9c27b0"
                : isSwapped
                ? "#2e7d32"
                : isComparing
                ? "#ed6c02"
                : "#1976d2",

              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              color: "white",
              fontSize: "10px",
              fontWeight: 700,
              paddingTop: "4px",
            }}
          >
            {array.length <= 35 ? value : ""}
          </motion.div>
        );
      })}
    </Box>
  );
}