import { SortStep } from "@/types/algorithm";

export function insertionSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];

  for (let i = 1; i < arr.length; i++) {
    let j = i;

    while (j > 0 && arr[j - 1] > arr[j]) {
      steps.push({ array: [...arr], comparing: [j - 1, j] });

      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];

      steps.push({ array: [...arr], swapped: [j - 1, j] });

      j--;
    }
  }

  return steps;
}