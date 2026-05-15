"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeContext } from "@/theme/ThemeContext";

const SortingVisualizer = dynamic(
  () => import("@/components/visualizers/sorting/SortingVisualizer"),
  { loading: () => <LoadingVisualizer label="Loading sorting visualizer..." /> }
);
const PathfindingVisualizer = dynamic(
  () => import("@/components/visualizers/pathfinding/PathfindingVisualizer"),
  { loading: () => <LoadingVisualizer label="Loading pathfinding visualizer..." /> }
);
const BacktrackingVisualizer = dynamic(
  () => import("@/components/visualizers/backtracking/BacktrackingVisualizer"),
  { loading: () => <LoadingVisualizer label="Loading backtracking visualizer..." /> }
);

type VisualizerCategory = "sorting" | "pathfinding" | "backtracking";

function LoadingVisualizer({ label }: { label: string }) {
  return (
    <Stack sx={{ alignItems: "center", gap: 2, py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

export default function AppShell() {
  const [category, setCategory] = useState<VisualizerCategory>("sorting");
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          mode === "dark"
            ? "radial-gradient(circle at top, rgba(25, 118, 210, 0.18), transparent 36%), linear-gradient(180deg, #0b1220 0%, #111827 100%)"
            : "radial-gradient(circle at top, rgba(25, 118, 210, 0.13), transparent 36%), linear-gradient(180deg, #f7faff 0%, #ffffff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: { xs: 2.5, md: 4 },
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack
              sx={{
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", md: "center" },
                gap: 3,
              }}
            >
              <Box>
                <Typography component="h1" variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
                  Realtime Algorithm Visualizer
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
                  Compare algorithms with interactive controls, step-by-step playback, and clean explanations.
                </Typography>
              </Box>

              <IconButton
                onClick={toggleTheme}
                aria-label="Toggle light/dark mode"
                sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Stack>

            <ToggleButtonGroup
              exclusive
              value={category}
              onChange={(_, value: VisualizerCategory | null) => value && setCategory(value)}
              sx={{
                mt: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                "& .MuiToggleButton-root": {
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: "divider",
                  px: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                },
              }}
            >
              <ToggleButton value="sorting">Sorting</ToggleButton>
              <ToggleButton value="pathfinding">Pathfinding</ToggleButton>
              <ToggleButton value="backtracking">Backtracking</ToggleButton>
            </ToggleButtonGroup>
          </Paper>

          <Suspense fallback={<LoadingVisualizer label="Loading visualizer..." />}>
            {category === "sorting" && <SortingVisualizer />}
            {category === "pathfinding" && <PathfindingVisualizer />}
            {category === "backtracking" && <BacktrackingVisualizer />}
          </Suspense>
        </Box>
      </Container>
    </Box>
  );
}
