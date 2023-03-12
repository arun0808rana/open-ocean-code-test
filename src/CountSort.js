export function countingSort(array) {
    if (array.length === 0) {
      return array;
    }
  
    // Determine the range of the input array
    let min = array[0];
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] < min) {
        min = array[i];
      } else if (array[i] > max) {
        max = array[i];
      }
    }
  
    // Initialize the count array with zeros
    const count = new Array(max - min + 1).fill(0);
  
    // Count the occurrences of each element in the input array
    for (let i = 0; i < array.length; i++) {
      count[array[i] - min]++;
    }
  
    // Modify the count array to reflect the final position of each element
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }
  
    // Build the sorted array
    const sorted = new Array(array.length);
    for (let i = array.length - 1; i >= 0; i--) {
      sorted[--count[array[i] - min]] = array[i];
    }
  
    return sorted;
  }
  