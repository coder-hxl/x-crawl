import https from 'node:http'

import { handleConfig, isNumber, isUndefined, random, sleep } from './utils'

import { IIntervalTime, IRequest, IRequestConfig } from './types'

export function request(config: IRequestConfig) {
  return new Promise<IRequest>((resolve, reject) => {
    const data = (config.data = config.data
      ? JSON.stringify(config.data ?? '')
      : config.data)
    const requestConfig = handleConfig(config)

    const req = https.request(requestConfig, (res) => {
      const { headers } = res

      const container: Buffer[] = []

      res.on('data', (chunk) => container.push(chunk))

      res.on('end', () => {
        const data = Buffer.concat(container)
        const resolveRes: IRequest = {
          headers,
          data
        }

        resolve(resolveRes)
      })
    })

    req.on('timeout', () => {
      console.log(`Timeout Error`)
      reject(new Error('Timeout'))
    })

    req.on('error', (err) => {
      console.log('Error: ', err.message)
      reject(err)
    })

    // 其他处理
    if (requestConfig.method === 'POST') {
      req.write(data)
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
