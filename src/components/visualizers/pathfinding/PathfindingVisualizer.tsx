"use client";

import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import PathfindingGrid from "./PathfindingGrid";
import { GridNode } from "@/types/pathfinding";
import { bfs } from "@/lib/algorithms/pathfinding/bfs";
import { dfs } from "@/lib/algorithms/pathfinding/dfs";
import { dijkstra } from "@/lib/algorithms/pathfinding/dijkstra";
import { astar } from "@/lib/algorithms/pathfinding/astar";
import Legend from "@/components/common/Legend";
import AlgorithmInfoCard from "@/components/common/AlgorithmInfoCard";
import AlgorithmExplanationDrawer from "@/components/common/AlgorithmExplanationDrawer";
import { pathfindingInfo } from "@/lib/algorithmInfo";

const DEFAULT_ROWS = 15;
const DEFAULT_COLS = 30;

type PathfindingAlgorithm = "bfs" | "dfs" | "dijkstra" | "astar";
type Position = { row: number; col: number };
type DragMode = "start" | "end" | "wall" | null;
type PathFrame = { row: number; col: number; type: "visited" | "path"; visitedCount: number; pathLength: number };

function getDefaultPositions(rows: number, cols: number) {
  const middleRow = Math.floor(rows / 2);
  return {
    start: { row: middleRow, col: Math.max(1, Math.floor(cols * 0.18)) },
    end: { row: middleRow, col: Math.max(2, Math.min(cols - 2, Math.floor(cols * 0.82))) },
  };
}

function createGrid(rows: number, cols: number, start: Position, end: Position): GridNode[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      type:
        row === start.row && col === start.col
          ? "start"
          : row === end.row && col === end.col
          ? "end"
          : "empty",
      distance: Infinity,
      previousNode: null,
    }))
  );
}

function resetSearchState(grid: GridNode[][]): GridNode[][] {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      type: node.type === "visited" || node.type === "path" ? "empty" : node.type,
      distance: Infinity,
      previousNode: null,
    }))
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PathfindingVisualizer() {
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithm>("bfs");
  const [rowCount, setRowCount] = useState(DEFAULT_ROWS);
  const [colCount, setColCount] = useState(DEFAULT_COLS);
  const initialPositions = getDefaultPositions(DEFAULT_ROWS, DEFAULT_COLS);
  const [startPos, setStartPos] = useState<Position>(initialPositions.start);
  const [endPos, setEndPos] = useState<Position>(initialPositions.end);
  const [grid, setGrid] = useState<GridNode[][]>(() => createGrid(DEFAULT_ROWS, DEFAULT_COLS, initialPositions.start, initialPositions.end));
  const [speed, setSpeed] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState("Drag Start/End or draw walls, then run an algorithm.");
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [frames, setFrames] = useState<PathFrame[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dragModeRef = useRef<DragMode>(null);
  const isPausedRef = useRef(false);
  const shouldStopRef = useRef(false);

  const placeSpecialNode = (row: number, col: number, mode: "start" | "end") => {
    const other = mode === "start" ? endPos : startPos;
    if (row === other.row && col === other.col) return;

    setGrid((prev) =>
      resetSearchState(prev).map((gridRow) =>
        gridRow.map((node) => {
          const isOld = mode === "start" ? node.type === "start" : node.type === "end";
          if (isOld) return { ...node, type: "empty" };
          if (node.row === row && node.col === col) return { ...node, type: mode };
          return node;
        })
      )
    );

    if (mode === "start") setStartPos({ row, col });
    else setEndPos({ row, col });
    setFrames([]);
    setFrameIndex(0);
    setVisitedCount(0);
    setPathLength(0);
  };

  const toggleWall = (row: number, col: number) => {
    setGrid((prev) =>
      resetSearchState(prev).map((gridRow) =>
        gridRow.map((node) => {
          if (node.row !== row || node.col !== col) return node;
          if (node.type === "start" || node.type === "end") return node;
          return { ...node, type: node.type === "wall" ? "empty" : "wall" };
        })
      )
    );
    setFrames([]);
    setFrameIndex(0);
  };

  const handleNodeMouseDown = (row: number, col: number) => {
    if (isRunning && !isPaused) return;
    const node = grid[row][col];
    if (node.type === "start") dragModeRef.current = "start";
    else if (node.type === "end") dragModeRef.current = "end";
    else {
      dragModeRef.current = "wall";
      toggleWall(row, col);
    }
  };

  const handleNodeMouseEnter = (row: number, col: number) => {
    if (isRunning && !isPaused) return;
    if (dragModeRef.current === "start" || dragModeRef.current === "end") {
      placeSpecialNode(row, col, dragModeRef.current);
    }
  };

  const handleMouseUp = () => {
    dragModeRef.current = null;
  };

  const clearPathOnly = () => {
    if (isRunning && !isPaused) return;
    setGrid((prev) => resetSearchState(prev));
    setVisitedCount(0);
    setPathLength(0);
    setFrames([]);
    setFrameIndex(0);
    setStatus("Path cleared. Walls are still preserved.");
  };

  const clearGrid = () => {
    shouldStopRef.current = true;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsRunning(false);
    const positions = getDefaultPositions(rowCount, colCount);
    setStartPos(positions.start);
    setEndPos(positions.end);
    setGrid(createGrid(rowCount, colCount, positions.start, positions.end));
    setVisitedCount(0);
    setPathLength(0);
    setFrames([]);
    setFrameIndex(0);
    setStatus("Grid reset.");
  };


  const resizeGrid = (rows: number, cols: number) => {
    if (isRunning && !isPaused) return;
    const positions = getDefaultPositions(rows, cols);
    setRowCount(rows);
    setColCount(cols);
    setStartPos(positions.start);
    setEndPos(positions.end);
    setGrid(createGrid(rows, cols, positions.start, positions.end));
    setVisitedCount(0);
    setPathLength(0);
    setFrames([]);
    setFrameIndex(0);
    setStatus(`Grid resized to ${rows} × ${cols}.`);
  };

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
    setStatus(isPausedRef.current ? "Paused. You can step forward/backward." : "Running...");
  };

  const buildFrames = (sourceGrid: GridNode[][]) => {
    const start = sourceGrid[startPos.row][startPos.col];
    const end = sourceGrid[endPos.row][endPos.col];
    const result =
      algorithm === "dfs"
        ? dfs(sourceGrid, start, end)
        : algorithm === "dijkstra"
        ? dijkstra(sourceGrid, start, end)
        : algorithm === "astar"
        ? astar(sourceGrid, start, end)
        : bfs(sourceGrid, start, end);

    const nextFrames: PathFrame[] = [];
    result.visitedOrder.forEach((node, index) => {
      if (node.type !== "start" && node.type !== "end") {
        nextFrames.push({ row: node.row, col: node.col, type: "visited", visitedCount: index + 1, pathLength: 0 });
      }
    });
    result.path.forEach((node, index) => {
      if (node.type !== "start" && node.type !== "end") {
        nextFrames.push({ row: node.row, col: node.col, type: "path", visitedCount: result.visitedOrder.length, pathLength: index + 1 });
      }
    });
    return { nextFrames, found: result.path.length > 0, pathMoves: Math.max(result.path.length - 1, 0) };
  };

  const applyFramesUntil = (index: number, nextFrames = frames) => {
    const base = resetSearchState(grid);
    const safeIndex = Math.max(0, Math.min(index, nextFrames.length));
    const visibleFrames = nextFrames.slice(0, safeIndex);
    const nextGrid = base.map((row) => row.map((node) => ({ ...node })));
    visibleFrames.forEach((frame) => {
      const node = nextGrid[frame.row][frame.col];
      if (node.type !== "start" && node.type !== "end" && node.type !== "wall") node.type = frame.type;
    });
    const last = visibleFrames.at(-1);
    setGrid(nextGrid);
    setVisitedCount(last?.visitedCount ?? 0);
    setPathLength(last?.pathLength ?? 0);
    setFrameIndex(safeIndex);
  };

  const stepForward = () => {
    const cleanGrid = resetSearchState(grid);
    const nextFrames = frames.length ? frames : buildFrames(cleanGrid).nextFrames;
    if (!frames.length) setFrames(nextFrames);
    setStatus("Stepping through the animation.");
    applyFramesUntil(frameIndex + 1, nextFrames);
  };

  const stepBackward = () => {
    if (!frames.length) return;
    setStatus("Stepping backward through the animation.");
    applyFramesUntil(frameIndex - 1, frames);
  };

  const runPathfinding = async () => {
    if (isRunning) return;
    shouldStopRef.current = false;
    isPausedRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
    setVisitedCount(0);
    setPathLength(0);
    setFrameIndex(0);
    setStatus("Running...");

    const gridCopy = resetSearchState(grid);
    setGrid(gridCopy);
    const { nextFrames, found, pathMoves } = buildFrames(gridCopy);
    setFrames(nextFrames);

    for (let index = 1; index <= nextFrames.length; index++) {
      if (shouldStopRef.current) return;
      while (isPausedRef.current) {
        if (shouldStopRef.current) return;
        await sleep(100);
      }
      applyFramesUntil(index, nextFrames);
      await sleep(speed);
    }

    setStatus(found ? `Path found with ${pathMoves} moves.` : "No path found. Try removing some walls.");
    setIsRunning(false);
    setIsPaused(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
        Pathfinding Visualizer
      </Typography>

      <Typography component="p" variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
        Build walls, move the start/end nodes, and compare graph-search algorithms step by step.
      </Typography>

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
                Pathfinding controls
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {pathfindingInfo[algorithm].name}
              </Typography>
            </Box>

            <Chip
              label={isRunning ? (isPaused ? "Paused" : "Running") : "Ready"}
              color={isRunning ? (isPaused ? "warning" : "success") : "default"}
              variant="outlined"
            />
          </Stack>

          <Stack
            sx={{
              flexDirection: "row",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={algorithm}
                label="Algorithm"
                disabled={isRunning}
                onChange={(e) => setAlgorithm(e.target.value as PathfindingAlgorithm)}
              >
                <MenuItem value="bfs">BFS</MenuItem>
                <MenuItem value="dfs">DFS</MenuItem>
                <MenuItem value="dijkstra">Dijkstra</MenuItem>
                <MenuItem value="astar">A*</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" disabled={isRunning} onClick={runPathfinding}>
              Run {pathfindingInfo[algorithm].name}
            </Button>

            {isRunning && (
              <Button variant="contained" color="secondary" onClick={togglePause}>
                {isPaused ? "Resume" : "Pause"}
              </Button>
            )}

            <Button variant="outlined" disabled={isRunning && !isPaused} onClick={stepBackward}>
              Step Backward
            </Button>

            <Button variant="outlined" disabled={isRunning && !isPaused} onClick={stepForward}>
              Step Forward
            </Button>

            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
              Explanation
            </Button>

            <Button variant="outlined" disabled={isRunning && !isPaused} onClick={clearPathOnly}>
              Clear Path Only
            </Button>

            <Button variant="outlined" color="error" onClick={clearGrid}>
              Clear Grid
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
                min={5}
                max={120}
                step={5}
                disabled={isRunning && !isPaused}
                onChange={(_, value) => setSpeed(value as number)}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography gutterBottom sx={{ fontWeight: 700 }}>
                Rows: {rowCount}
              </Typography>
              <Slider
                value={rowCount}
                min={8}
                max={25}
                step={1}
                disabled={isRunning && !isPaused}
                onChange={(_, value) => resizeGrid(value as number, colCount)}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography gutterBottom sx={{ fontWeight: 700 }}>
                Columns: {colCount}
              </Typography>
              <Slider
                value={colCount}
                min={12}
                max={50}
                step={1}
                disabled={isRunning && !isPaused}
                onChange={(_, value) => resizeGrid(rowCount, value as number)}
              />
            </Box>
          </Stack>

          <Stack sx={{ flexDirection: "row", gap: 1, flexWrap: "wrap", mt: 2 }}>
            <Chip label={`Visited: ${visitedCount}`} variant="outlined" />
            <Chip label={`Path nodes: ${pathLength}`} variant="outlined" />
            <Chip label={`Frame: ${frameIndex}/${frames.length}`} variant="outlined" />
          </Stack>

          <Alert severity={status.startsWith("No path") ? "warning" : "info"} sx={{ mt: 2 }}>
            {status}
          </Alert>
        </CardContent>
      </Card>

      <Paper elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2, md: 3 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}>
        <Legend items={[{ label: "Start", color: "#2e7d32" }, { label: "End", color: "#d32f2f" }, { label: "Wall", color: "#212121" }, { label: "Visited", color: "#0288d1" }, { label: "Path", color: "#ed6c02" }]} />
        <PathfindingGrid grid={grid} onNodeMouseDown={handleNodeMouseDown} onNodeMouseEnter={handleNodeMouseEnter} onMouseUp={handleMouseUp} />
      </Paper>

      <Paper elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2, md: 3 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}>
        <AlgorithmInfoCard info={pathfindingInfo[algorithm]} />
      </Paper>

      <AlgorithmExplanationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} info={pathfindingInfo[algorithm]} />
    </Box>
  );
}
