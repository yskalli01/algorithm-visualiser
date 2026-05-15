import { SortStep } from "@/types/algorithm";

export function mergeSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];

  function mergeSort(left: number, right: number) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    mergeSort(left, mid);
    mergeSort(mid + 1, right);

    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      steps.push({ array: [...arr], comparing: [i, j] });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }

    while (i <= mid) temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);

    for (let k = left; k <= right; k++) {
      arr[k] = temp[k - left];
      steps.push({ array: [...arr], swapped: [k, k] });
    }
  }

  mergeSort(0, arr.length - 1);

  return steps;
}