function swap(arr: any[], i: number, j: number) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function quickSort<T extends any[]>(arr: T): T {
  const n = arr.length

  partition(0, n - 1)

  function partition(left: number, right: number) {
    if (left >= right) return

    // 1.找基准元素
    const pivot = arr[right]

    // 2.定义双指针进行交换(左小右大)
    let i = left
    let j = right - 1
    while (i <= j) {
      while (arr[i] < pivot) {
        i++
      }

      while (arr[j] > pivot) {
        j--
      }

      if (i <= j) {
        swap(arr, i, j)
        i++
        j--
      }
    }

    // 3.将 pivot 放到正确位置
    swap(arr, i, right)

    // 4.左右划分区域
    partition(left, i - 1)
    partition(i + 1, right)
  }

  return arr
}

// console.log(quickSort([7, 3, 6, 4, 9, 2, 1, 5]))
