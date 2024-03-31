import { Buffer } from 'node:buffer'
import chalk from 'chalk'

// Log
export const log = console.log
export const logStart = chalk.blueBright
export const logStatistics = chalk.whiteBright
export const logSuccess = chalk.green
export const logError = chalk.red
export const logWarn = chalk.yellow
export const logNumber = chalk.hex('#a57fff')
export const whiteBold = chalk.white.bold

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined'
}

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: any): value is string {
  return typeof value === 'boolean'
}

export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

export function isPromise(value: any): value is Promise<any> {
  return typeof value === 'function' && !isUndefined(value.then)
}

export function isBuffer(value: any): value is Buffer {
  return Buffer.isBuffer(value)
}

export function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export function random(max: number, min = 0) {
  let result = Math.floor(Math.random() * max)

  while (result < min) {
    result = Math.floor(Math.random() * max)
  }

  return result
}

export function mergeSort<T extends any[]>(arr: T): T {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const newLeftArr = mergeSort(arr.slice(0, mid))
  const newRightArr = mergeSort(arr.slice(mid))

  const newArr = [] as any as T
  let i = 0
  let j = 0
  while (i < newLeftArr.length && j < newRightArr.length) {
    if (newLeftArr[i] <= newRightArr[j]) {
      newArr.push(newLeftArr[i++])
    } else {
      newArr.push(newRightArr[j++])
    }
  }

  if (i < newLeftArr.length) {
    newArr.push(...newLeftArr.slice(i))
  }

  if (j < newRightArr.length) {
    newArr.push(...newRightArr.splice(j))
  }

  return newArr
}
