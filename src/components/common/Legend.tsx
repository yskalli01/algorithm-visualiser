import { Box, Typography } from "@mui/material";

type LegendItem = {
  label: string;
  color: string;
};

type Props = {
  items: LegendItem[];
};

export default function Legend({ items }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "wrap",
        my: 2,
      }}
    >
      {items.map((item) => (
        <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "4px",
              bgcolor: item.color,
              border: "1px solid",
              borderColor: "divider",
            }}
          />

          <Typography variant="body2">{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}