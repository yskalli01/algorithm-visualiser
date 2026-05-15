"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

type Algorithm = "bubble" | "selection" | "insertion" | "merge" | "quick";

type Props = {
  speed: number;
  isRunning: boolean;
  onSpeedChange: (value: number) => void;
  onStart: () => void;
  onReset: () => void;
  onGenerate: () => void;
  algorithm: Algorithm;
  onAlgorithmChange: (value: Algorithm) => void;
  onPauseResume: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onOpenExplanation: () => void;
  canStep: boolean;
  isPaused: boolean;
  arrayLength: number;
  onArrayLengthChange: (value: number) => void;
};

export default function SortingControls({
  speed,
  isRunning,
  onSpeedChange,
  onStart,
  onReset,
  onGenerate,
  algorithm,
  onAlgorithmChange,
  onPauseResume,
  onStepForward,
  onStepBackward,
  onOpenExplanation,
  canStep,
  isPaused,
  arrayLength,
  onArrayLengthChange,
}: Props) {
  const algorithmLabel =
    algorithm === "selection"
      ? "Selection Sort"
      : algorithm === "insertion"
      ? "Insertion Sort"
      : algorithm === "merge"
      ? "Merge Sort"
      : algorithm === "quick"
      ? "Quick Sort"
      : "Bubble Sort";

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        mb: 3,
        borderRadius: 5,
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          sx={{
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
              Sorting controls
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {algorithmLabel}
            </Typography>
          </Box>

          <Chip
            label={isRunning ? (isPaused ? "Paused" : "Running") : "Ready"}
            color={isRunning ? (isPaused ? "warning" : "success") : "default"}
            variant="outlined"
          />
        </Stack>

        <Stack sx={{ flexDirection: "row", gap: 1.5, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel>Algorithm</InputLabel>
            <Select
              value={algorithm}
              label="Algorithm"
              onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
              disabled={isRunning}
            >
              <MenuItem value="bubble">Bubble Sort</MenuItem>
              <MenuItem value="selection">Selection Sort</MenuItem>
              <MenuItem value="insertion">Insertion Sort</MenuItem>
              <MenuItem value="merge">Merge Sort</MenuItem>
              <MenuItem value="quick">Quick Sort</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" disabled={isRunning} onClick={onStart}>
            Start
          </Button>
          <Button variant="outlined" disabled={isRunning} onClick={onGenerate}>
            Generate Array
          </Button>
          <Button variant="outlined" color="error" onClick={onReset}>
            Reset
          </Button>
          {isRunning && (
            <Button variant="contained" color="secondary" onClick={onPauseResume}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}
          <Button variant="outlined" disabled={!canStep || (isRunning && !isPaused)} onClick={onStepBackward}>
            Step Backward
          </Button>
          <Button variant="outlined" disabled={!canStep || (isRunning && !isPaused)} onClick={onStepForward}>
            Step Forward
          </Button>
          <Button variant="outlined" onClick={onOpenExplanation}>
            Explanation
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack sx={{ flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom sx={{ fontWeight: 700 }}>
              Speed: {speed}ms
            </Typography>
            <Slider
              value={speed}
              min={20}
              max={500}
              step={20}
              disabled={isRunning && !isPaused}
              onChange={(_, value) => onSpeedChange(value as number)}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom sx={{ fontWeight: 700 }}>
              Array Length: {arrayLength}
            </Typography>
            <Slider
              value={arrayLength}
              min={5}
              max={100}
              step={1}
              disabled={isRunning}
              onChange={(_, value) => onArrayLengthChange(value as number)}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
