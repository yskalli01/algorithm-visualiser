"use client";

import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

import NQueensBoard from "./NQueensBoard";
import { nQueensSteps } from "@/lib/algorithms/backtracking/nQueens";
import { MazeCell, MazeStep, QueenStep } from "@/types/backtracking";
import MazeBoard from "./MazeBoard";
import { mazeSolverSteps } from "@/lib/algorithms/backtracking/mazeSolver";
import AlgorithmInfoCard from "@/components/common/AlgorithmInfoCard";
import AlgorithmExplanationDrawer from "@/components/common/AlgorithmExplanationDrawer";
import { backtrackingInfo } from "@/lib/algorithmInfo";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createBoard(n: number) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

const MAZE_ROWS = 15;
const MAZE_COLS = 30;

const MAZE_START = { row: 7, col: 4 };
const MAZE_END = { row: 7, col: 25 };

function createMaze(): MazeCell[][] {
  return Array.from({ length: MAZE_ROWS }, (_, row) =>
    Array.from({ length: MAZE_COLS }, (_, col) => ({
      row,
      col,
      type:
        row === MAZE_START.row && col === MAZE_START.col
          ? "start"
          : row === MAZE_END.row && col === MAZE_END.col
          ? "end"
          : "empty",
    }))
  );
}

function clearMazePath(maze: MazeCell[][]) {
  return maze.map((row) =>
    row.map((cell) => ({
      ...cell,
      type:
        cell.type === "visited" || cell.type === "path" ? "empty" : cell.type,
    }))
  );
}

export default function BacktrackingVisualizer() {
  const [maze, setMaze] = useState<MazeCell[][]>(() => createMaze());
  const [algorithm, setAlgorithm] = useState<"nqueens" | "maze">("nqueens");
  const [size, setSize] = useState(8);
  const [speed, setSpeed] = useState(120);
  const [board, setBoard] = useState<number[][]>(() => createBoard(8));
  const [currentStep, setCurrentStep] = useState<QueenStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [checks, setChecks] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [status, setStatus] = useState("Choose an algorithm and press Run.");
  const [queenSteps, setQueenSteps] = useState<QueenStep[]>([]);
  const [mazeSteps, setMazeSteps] = useState<MazeStep[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isPausedRef = useRef(false);
  const shouldStopRef = useRef(false);

  const waitIfPaused = async () => {
    while (isPausedRef.current) {
      if (shouldStopRef.current) return;
      await sleep(100);
    }
  };

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
    setStatus(isPausedRef.current ? "Paused." : "Running...");
  };


  const activeSteps = algorithm === "nqueens" ? queenSteps : mazeSteps;

  const applyQueenStep = (index: number, steps = queenSteps) => {
    if (!steps.length) return;
    const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[safeIndex];
    setBoard(step.board);
    setCurrentStep(step);
    setStepIndex(safeIndex + 1);
    setChecks(steps.slice(0, safeIndex + 1).filter((item) => item.action === "check").length);
    setBacktracks(steps.slice(0, safeIndex + 1).filter((item) => item.action === "remove").length);
    setStatus(step.action === "solution" ? "Solution found." : "Stepping through N-Queens.");
  };

  const applyMazeStep = (index: number, steps = mazeSteps) => {
    if (!steps.length) return;
    const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[safeIndex];
    setMaze(step.maze);
    setStepIndex(safeIndex + 1);
    setChecks(steps.slice(0, safeIndex + 1).filter((item) => item.action === "visit").length);
    setBacktracks(steps.slice(0, safeIndex + 1).filter((item) => item.action === "backtrack").length);
    const solved = steps.slice(0, safeIndex + 1).some((item) => item.action === "solution");
    setStatus(solved ? "Maze solved." : "Stepping through Maze Solver.");
  };

  const buildCurrentSteps = () => {
    if (algorithm === "nqueens") {
      const steps = queenSteps.length ? queenSteps : nQueensSteps(size);
      if (!queenSteps.length) {
        setQueenSteps(steps);
        setTotalSteps(steps.length);
      }
      return steps;
    }

    const steps = mazeSteps.length ? mazeSteps : mazeSolverSteps(clearMazePath(maze).map((row) => row.map((cell) => ({ ...cell }))));
    if (!mazeSteps.length) {
      setMazeSteps(steps);
      setTotalSteps(steps.length);
    }
    return steps;
  };

  const stepForward = () => {
    const steps = buildCurrentSteps();
    if (algorithm === "nqueens") applyQueenStep(stepIndex, steps as QueenStep[]);
    else applyMazeStep(stepIndex, steps as MazeStep[]);
  };

  const stepBackward = () => {
    if (!activeSteps.length) return;
    if (algorithm === "nqueens") applyQueenStep(stepIndex - 2);
    else applyMazeStep(stepIndex - 2);
  };

  const runNQueens = async () => {
    if (isRunning) return;

    shouldStopRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsRunning(true);
    setStepIndex(0);
    setChecks(0);
    setBacktracks(0);
    setStatus("Running...");

    const steps = queenSteps.length ? queenSteps : nQueensSteps(size);
    setQueenSteps(steps);
    setTotalSteps(steps.length);

    for (let index = 0; index < steps.length; index++) {
      if (shouldStopRef.current) return;
      await waitIfPaused();
      if (shouldStopRef.current) return;

      const step = steps[index];
      setBoard(step.board);
      setCurrentStep(step);
      setStepIndex(index + 1);
      if (step.action === "check") setChecks((value) => value + 1);
      if (step.action === "remove") setBacktracks((value) => value + 1);
      await sleep(speed);
    }

    setStatus("Solution found.");
    setIsRunning(false);
    setIsPaused(false);
  };

  const reset = () => {
    shouldStopRef.current = true;
    isPausedRef.current = false;
    setBoard(createBoard(size));
    setCurrentStep(null);
    setIsRunning(false);
    setIsPaused(false);
    setStepIndex(0);
    setTotalSteps(0);
    setChecks(0);
    setBacktracks(0);
    setQueenSteps([]);
    setStatus("N-Queens reset.");
  };

  const handleMazeCellClick = (row: number, col: number) => {
    if (isRunning) return;

    setMazeSteps([]);
    setStepIndex(0);
    setTotalSteps(0);
    setMaze((prev) =>
      prev.map((mazeRow) =>
        mazeRow.map((cell) => {
          if (cell.row !== row || cell.col !== col) return cell;
          if (cell.type === "start" || cell.type === "end") return cell;

          return {
            ...cell,
            type: cell.type === "wall" ? "empty" : "wall",
          };
        })
      )
    );
  };

  const runMazeSolver = async () => {
    if (isRunning) return;

    shouldStopRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsRunning(true);
    setStepIndex(0);
    setChecks(0);
    setBacktracks(0);
    setStatus("Running...");

    const mazeCopy = clearMazePath(maze);
    setMaze(mazeCopy);
    const steps = mazeSolverSteps(mazeCopy.map((row) => row.map((cell) => ({ ...cell }))));
    setMazeSteps(steps);
    setTotalSteps(steps.length);

    for (let index = 0; index < steps.length; index++) {
      if (shouldStopRef.current) return;
      await waitIfPaused();
      if (shouldStopRef.current) return;

      const step = steps[index];
      setMaze(step.maze);
      setStepIndex(index + 1);
      if (step.action === "visit") setChecks((value) => value + 1);
      if (step.action === "backtrack") setBacktracks((value) => value + 1);
      await sleep(speed);
    }

    const solved = steps.some((step) => step.action === "solution");
    setStatus(solved ? "Maze solved." : "No path found. Try removing walls.");
    setIsRunning(false);
    setIsPaused(false);
  };

  const resetMaze = () => {
    shouldStopRef.current = true;
    isPausedRef.current = false;
    setMaze(createMaze());
    setIsRunning(false);
    setIsPaused(false);
    setStepIndex(0);
    setTotalSteps(0);
    setChecks(0);
    setBacktracks(0);
    setMazeSteps([]);
    setStatus("Maze reset.");
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        Backtracking Visualizer
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Algorithm</InputLabel>

            <Select
              value={algorithm}
              label="Algorithm"
              disabled={isRunning}
              onChange={(e) => {
                const nextAlgorithm = e.target.value as "nqueens" | "maze";
                setAlgorithm(nextAlgorithm);
                setStatus("Choose an algorithm and press Run.");
                setStepIndex(0);
                setTotalSteps(0);
                setChecks(0);
                setBacktracks(0);
                setQueenSteps([]);
                setMazeSteps([]);
              }}
            >
              <MenuItem value="nqueens">N-Queens</MenuItem>
              <MenuItem value="maze">Maze Solver</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            disabled={isRunning}
            onClick={algorithm === "nqueens" ? runNQueens : runMazeSolver}
          >
            Run {algorithm === "nqueens" ? "N-Queens" : "Maze Solver"}
          </Button>

          {isRunning && (
            <Button variant="contained" color="secondary" onClick={togglePause}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}

          <Button variant="outlined" disabled={!activeSteps.length || (isRunning && !isPaused)} onClick={stepBackward}>
            Step Backward
          </Button>

          <Button variant="outlined" disabled={isRunning && !isPaused} onClick={stepForward}>
            Step Forward
          </Button>

          <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
            Explanation
          </Button>

          <Button variant="outlined" onClick={algorithm === "nqueens" ? reset : resetMaze}>
            Reset
          </Button>
        </Box>

        <Typography>Board Size: {size}</Typography>
        <Slider
          value={size}
          min={4}
          max={12}
          step={1}
          disabled={isRunning || algorithm === "maze"}
          onChange={(_, value) => {
            const newSize = value as number;
            setSize(newSize);
            setBoard(createBoard(newSize));
            setCurrentStep(null);
            setStepIndex(0);
            setTotalSteps(0);
            setQueenSteps([]);
          }}
        />

        <Typography sx={{ mt: 2 }}>Speed: {speed}ms</Typography>
        <Slider
          value={speed}
          min={20}
          max={500}
          step={20}
          disabled={isRunning && !isPaused}
          onChange={(_, value) => setSpeed(value as number)}
        />

        <Stack sx={{ flexDirection: "row", gap: 1, flexWrap: "wrap", mt: 2 }}>
          <Chip label={`Step: ${stepIndex}/${totalSteps}`} />
          <Chip label={algorithm === "nqueens" ? `Checks: ${checks}` : `Visited: ${checks}`} />
          <Chip label={`Backtracks: ${backtracks}`} />
        </Stack>

        <Alert severity={status.startsWith("No path") ? "warning" : "info"} sx={{ mt: 2 }}>
          {status}
        </Alert>

        <AlgorithmInfoCard info={backtrackingInfo[algorithm]} />
      </Paper>

      {algorithm === "nqueens" ? (
        <NQueensBoard board={board} currentStep={currentStep} />
      ) : (
        <MazeBoard maze={maze} onCellClick={handleMazeCellClick} />
      )}

      <AlgorithmExplanationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} info={backtrackingInfo[algorithm]} />
    </Box>
  );
}
