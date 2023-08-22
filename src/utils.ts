import chalk from 'chalk'

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

export const log = console.log
export const logStart = chalk.blueBright
export const logStatistics = chalk.whiteBright
export const logSuccess = chalk.green
export const logError = chalk.red
export const logWarn = chalk.yellow
export const logNumber = chalk.hex('#a57fff')

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined'
}

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isObject(value: any): value is object {
  return typeof value === 'object' && value && !Array.isArray(value)
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}
