"use client";

import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { AlgorithmInfo } from "@/lib/algorithmInfo";

type Props = {
  info: AlgorithmInfo;
};

export default function AlgorithmInfoCard({ info }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        mt: 2,
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
          Algorithm notes
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          {info.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 820 }}>
          {info.description}
        </Typography>

        <Stack sx={{ flexDirection: "row", gap: 1, flexWrap: "wrap" }}>
          <Chip label={`Time: ${info.time}`} size="small" color="primary" variant="outlined" />
          <Chip label={`Space: ${info.space}`} size="small" color="primary" variant="outlined" />
          {info.stable && <Chip label={`Stable: ${info.stable}`} size="small" />}
          {info.optimal && <Chip label={`Optimal: ${info.optimal}`} size="small" />}
          {info.recursive && <Chip label={`Recursive: ${info.recursive}`} size="small" />}
        </Stack>
      </CardContent>
    </Card>
  );
}
