import chalk from 'chalk'

export function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export function random(max: number, min = 0) {
  let res = Math.floor(Math.random() * max)

  while (res < min) {
    res = Math.floor(Math.random() * max)
  }

  return res
}

export const log = console.log
export const logNumber = chalk.hex('#a57fff')
export const logSuccess = chalk.green
export const logError = chalk.red
export const logWarn = chalk.yellow

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined'
}

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}
