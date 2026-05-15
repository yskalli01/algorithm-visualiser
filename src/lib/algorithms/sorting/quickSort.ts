import { SortStep } from "@/types/algorithm";

export function quickSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];

  function partition(low: number, high: number) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], comparing: [j, high] });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ array: [...arr], swapped: [i, j] });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ array: [...arr], swapped: [i + 1, high] });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(low, high);

      quickSort(low, pivotIndex - 1);
      quickSort(pivotIndex + 1, high);
    }
  }

  quickSort(0, arr.length - 1);

  return steps;
}