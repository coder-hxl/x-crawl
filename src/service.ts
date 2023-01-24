import https from 'node:http'
import fs from 'node:fs'

import { handleConfig, random, sleep } from './utils'

import {
  IFetchConfig,
  IFetchFileConfig,
  IRequest,
  IRequestConfig
} from './types'

function request(config: IRequestConfig) {
  return new Promise<IRequest>((resolve, reject) => {
    const data = (config.data = JSON.stringify(config.data ?? ''))
    const handleConfigRes = handleConfig(config)

    const req = https.request(handleConfigRes, (res) => {
      const container: Buffer[] = []

      res.on('data', (chunk) => container.push(chunk))

      res.on('end', () => {
        const data = Buffer.concat(container)
        const resolveRes: IRequest = {
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'],
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
    if (handleConfigRes.method === 'POST') {
      req.write(data)
    }

    req.end()
  })
}

export async function fetch<T = any>(config: IFetchConfig): Promise<T> {
  const { requestConifg, intervalTime } = config

  let res
  if (Array.isArray(requestConifg)) {
    res = []

    for (const item of requestConifg) {
      const requestRes = await request(item)
      res.push(JSON.parse(requestRes.data.toString()))

      if (typeof intervalTime !== 'undefined') {
        const timeout =
          typeof intervalTime === 'number'
            ? intervalTime
            : random(intervalTime.max, intervalTime.min)

        await sleep(timeout)
      }
    }
  } else {
    const requestRes = await request(requestConifg)
    res = JSON.parse(requestRes.data.toString())
  }

  return res
}

export async function fetchFile(config: IFetchFileConfig) {
  const { requestConifg, intervalTime, fileConfig } = config

  const requestConifgArr = Array.isArray(requestConifg)
    ? requestConifg
    : [requestConifg]

  const total = requestConifgArr.length
  let currentCount = 0
  let successCount = 0

  await Promise.resolve()

  console.log(`Start downloading, total: ${total} `)

  for (const item of requestConifgArr) {
    currentCount++

    const requestRes = await request(item)

    const { contentType, data } = requestRes
    const filename = `${new Date().getTime()}.${contentType?.split('/').pop()}`
    const path = `${fileConfig.storeDir}/${filename}`

    fs.createWriteStream(path, 'binary').write(data, (err) => {
      if (err) {
        return console.log(
          `File save error requested for the ${currentCount}: ${err.message}`
        )
      }

      if (++successCount === total) {
        console.log('All files downloaded successfully!')
      }
    })

    if (typeof intervalTime !== 'undefined' && currentCount !== total) {
      const timeout =
        typeof intervalTime === 'number'
          ? intervalTime
          : random(intervalTime.max, intervalTime.min)

      console.log(
        `The ${currentCount} request is success, sleep for ${timeout}ms`
      )

      await sleep(timeout)
    } else {
      console.log(`The ${currentCount} request is success`)
    }
  }
}
