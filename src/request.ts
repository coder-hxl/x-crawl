import http from 'node:http'

import {
  handleRequestConfig,
  isNumber,
  isUndefined,
  random,
  sleep
} from './utils'

import { IIntervalTime, IRequest, IRequestConfig } from './types'

export function request(config: IRequestConfig) {
  return new Promise<IRequest>((resolve, reject) => {
    const isDataUndefine = isUndefined(config.data)
    config.data = !isDataUndefine ? JSON.stringify(config.data) : config.data

    const requestConfig = handleRequestConfig(config)

    const req = http.request(requestConfig, (res) => {
      const { statusCode, headers } = res

      const container: Buffer[] = []

      res.on('data', (chunk) => container.push(chunk))

      res.on('end', () => {
        const data = Buffer.concat(container)
        const resolveRes: IRequest = {
          statusCode,
          headers,
          data
        }

        resolve(resolveRes)
      })
    })

    req.on('timeout', () => {
      reject(new Error(`Timeout ${config.timeout}ms`))
    })

    req.on('error', (err) => {
      reject(err)
    })

    // 其他处理
    if (requestConfig.method === 'POST' && !isDataUndefine) {
      req.write(config.data)
    }

    req.end()
  })
}

export async function batchRequest(
  requestConifgs: IRequestConfig[],
  intervalTime: IIntervalTime | undefined,
  eachRequestResHandle: (requestRes: IRequest, currentCount: number) => any
) {
  const total = requestConifgs.length
  let currentCount = 0

  console.log(`Begin execution, total: ${total} `)

  for (const requestConifg of requestConifgs) {
    currentCount++

    const requestRes = await request(requestConifg)

    eachRequestResHandle(requestRes, currentCount)

    if (!isUndefined(intervalTime) && currentCount !== total) {
      const timeout = isNumber(intervalTime)
        ? intervalTime
        : random(intervalTime.max, intervalTime.min)

      console.log(
        `The ${currentCount} request is success, sleep for ${timeout}ms`
      )

      await sleep(timeout)
    } else {
      console.log(
        `The ${currentCount} request is success, all requests completed!`
      )
    }
  }
}
