"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import SortingBars from "./SortingBars";
import SortingControls from "./SortingControls";

import { bubbleSortSteps } from "@/lib/algorithms/sorting/bubbleSort";
import { selectionSortSteps } from "@/lib/algorithms/sorting/selectionSort";
import { insertionSortSteps } from "@/lib/algorithms/sorting/insertionSort";
import { mergeSortSteps } from "@/lib/algorithms/sorting/mergeSort";
import { quickSortSteps } from "@/lib/algorithms/sorting/quickSort";

import { SortStep } from "@/types/algorithm";
import Legend from "@/components/common/Legend";
import AlgorithmInfoCard from "@/components/common/AlgorithmInfoCard";
import AlgorithmExplanationDrawer from "@/components/common/AlgorithmExplanationDrawer";
import { sortingInfo } from "@/lib/algorithmInfo";


function generateArray(length: number) {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * 260) + 30
  );
}

export default function SortingVisualizer() {
  const [arrayLength, setArrayLength] = useState(32);
  const originalArrayRef = useRef<number[]>(generateArray(arrayLength));
  const [array, setArray] = useState<number[]>(originalArrayRef.current);

  const [algorithm, setAlgorithm] = useState<
  "bubble" | "selection" | "insertion" | "merge" | "quick"
>("bubble");
  const [speed, setSpeed] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<SortStep | null>(null);
  const [finished, setFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const isPausedRef = useRef(false);
  const shouldStopRef = useRef(false);

  const generateNewArray = () => {
    const newArray = generateArray(arrayLength);

    originalArrayRef.current = newArray;

    setArray(newArray);
    setCurrentStep(null);
    setFinished(false);
    setStepIndex(0);
    setTotalSteps(0);
    setComparisons(0);
    setSwaps(0);
    setSteps([]);
  };

  const resetArray = () => {
    shouldStopRef.current = true;
    isPausedRef.current = false;
  
    setIsRunning(false);
    setIsPaused(false);
    setArray(originalArrayRef.current);
    setCurrentStep(null);
    setFinished(false);
    setStepIndex(0);
    setTotalSteps(0);
    setComparisons(0);
    setSwaps(0);
    setSteps([]);
  };

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  const getSteps = () =>
    algorithm === "selection"
      ? selectionSortSteps(array)
      : algorithm === "insertion"
      ? insertionSortSteps(array)
      : algorithm === "merge"
      ? mergeSortSteps(array)
      : algorithm === "quick"
      ? quickSortSteps(array)
      : bubbleSortSteps(array);

  const applySortStep = (index: number, nextSteps = steps) => {
    if (nextSteps.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, nextSteps.length - 1));
    const step = nextSteps[safeIndex];
    setArray(step.array);
    setCurrentStep(step);
    setStepIndex(safeIndex + 1);
    setComparisons(nextSteps.slice(0, safeIndex + 1).filter((item) => item.comparing).length);
    setSwaps(nextSteps.slice(0, safeIndex + 1).filter((item) => item.swapped).length);
    setFinished(safeIndex === nextSteps.length - 1);
  };

  const stepForward = () => {
    const nextSteps = steps.length ? steps : getSteps();
    if (!steps.length) {
      setSteps(nextSteps);
      setTotalSteps(nextSteps.length);
    }
    applySortStep(stepIndex, nextSteps);
  };

  const stepBackward = () => {
    if (!steps.length) return;
    applySortStep(stepIndex - 2, steps);
  };

  const startSorting = async () => {
    shouldStopRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
    setFinished(false);
    setStepIndex(0);
    setComparisons(0);
    setSwaps(0);
  
    const steps = getSteps();
    setSteps(steps);
    setTotalSteps(steps.length);
  
    for (let index = stepIndex; index < steps.length; index++) {
      const step = steps[index];
      if (shouldStopRef.current) {
        return;
      }
  
      while (isPausedRef.current) {
        if (shouldStopRef.current) {
          return;
        }
  
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
  
      setArray(step.array);
      setCurrentStep(step);
      setStepIndex(index + 1);
      if (step.comparing) setComparisons((value) => value + 1);
      if (step.swapped) setSwaps((value) => value + 1);
  
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  
    setCurrentStep(null);
    setIsRunning(false);
    setIsPaused(false);
    setFinished(true);
  };

  useEffect(() => {
    const newArray = generateArray(arrayLength);
  
    originalArrayRef.current = newArray;
  
    setArray(newArray);
    setCurrentStep(null);
    setFinished(false);
    setStepIndex(0);
    setTotalSteps(0);
    setComparisons(0);
    setSwaps(0);
    setSteps([]);
  }, [arrayLength]);

  return (
    <Container maxWidth="lg" disableGutters>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
          Sorting Visualizer
        </Typography>

        <Typography component="p" variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
          Visualize sorting algorithms step by step with animated bars.
        </Typography>

        <SortingControls
          speed={speed}
          isRunning={isRunning}
          onSpeedChange={setSpeed}
          onStart={startSorting}
          onReset={resetArray}
          onGenerate={generateNewArray}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          onPauseResume={togglePause}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onOpenExplanation={() => setDrawerOpen(true)}
          canStep={steps.length > 0 || !isRunning}
          isPaused={isPaused}
          arrayLength={arrayLength}
          onArrayLengthChange={setArrayLength}
        />

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2, md: 3 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Legend
          items={[
            { label: "Default", color: "#1976d2" },
            { label: "Comparing", color: "#ed6c02" },
            { label: "Swapped", color: "#2e7d32" },
            { label: "Finished", color: "#9c27b0" },
          ]}
        />
          <SortingBars
            array={array}
            comparing={currentStep?.comparing}
            swapped={currentStep?.swapped}
            finished={finished}
          />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2, md: 3 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack sx={{ flexDirection: "row", gap: 1, flexWrap: "wrap" }}>
            <Chip label={`Step: ${stepIndex}/${totalSteps}`} />
            <Chip label={`Comparisons: ${comparisons}`} />
            <Chip label={`Writes/Swaps: ${swaps}`} />
          </Stack>
          <AlgorithmInfoCard info={sortingInfo[algorithm]} />
        </Paper>

      </Box>
      <AlgorithmExplanationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        info={sortingInfo[algorithm]}
      />
    </Container>
  );
}