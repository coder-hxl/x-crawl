import https from 'node:http'
import fs from 'node:fs'

import { handleConfig, random, sleep } from './utils'

import { IFetchConfig, IFetchFileConfig, IRequestConfig } from './types'

function request(config: IRequestConfig) {
  return new Promise<Buffer>((resolve, reject) => {
    const data = (config.data = JSON.stringify(config.data ?? ''))
    const requestConfig = handleConfig(config)
    // console.log('requestConfig: ', requestConfig)

    const req = https.request(requestConfig, (res) => {
      const content: Buffer[] = []

      res.on('data', (chunk) => content.push(chunk))

      res.on('end', () => {
        resolve(Buffer.concat(content))
      })
    })

    req.on('error', (err) => {
      console.log('err: ', err.message)
      reject(err)
    })

    if (requestConfig.method.toLowerCase() === 'post') {
      // console.log('requestConfig data: ', data)
      req.write(data)
    }

    req.end()
  })
}

export async function fetch<T = any>(config: IFetchConfig): Promise<T> {
  const { requestConifg, intervalTime } = config
  let res

  async function getValue(req: IRequestConfig) {
    const bufferRes = await request(req)
    return JSON.parse(bufferRes.toString())
  }

  if (Array.isArray(requestConifg)) {
    res = []

    for (const item of requestConifg) {
      const value = await getValue(item)
      res.push(value)

      if (intervalTime) {
        const timeout = random(intervalTime.max, intervalTime.min)
        await sleep(timeout)
      }
    }
  } else {
    res = getValue(requestConifg)
  }

  return res
}

export async function fetchFile(config: IFetchFileConfig) {
  const { requestConifg, intervalTime, fileConfig } = config

  const isRqeArr = Array.isArray(requestConifg)
  const requestConifgArr = isRqeArr ? requestConifg : [requestConifg]

  const sum = requestConifgArr.length
  let currentCount = 0

  console.log(`开始下载, 总数: ${sum} `)

  for (const item of requestConifgArr) {
    currentCount++

    const res = await request(item)
    const filename = new Date().getTime() + fileConfig.suffix
    const path = fileConfig.storeDir + '/' + filename

    fs.createWriteStream(path, 'binary').write(res)
    console.log(`当前: ${currentCount}`)

    if (intervalTime && isRqeArr && currentCount !== sum) {
      const timeout = random(intervalTime.max, intervalTime.min)
      await sleep(timeout)
    }
  }

  console.log('下载完成')
}
