import { SortStep } from "@/types/algorithm";

export function selectionSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ array: [...arr], comparing: [minIndex, j] });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push({ array: [...arr], swapped: [i, minIndex] });
    }
  }

  return steps;
}