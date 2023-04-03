import process from 'node:process'
import path from 'node:path'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from '../../src'

const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('../../src').default
} else if (environment === 'pro') {
  xCrawl = require('../../publish/dist')
}

jest.setTimeout(60000)

const requestConfig: string[] = [
  'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg',
  'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4403.jpg'
]

const storeDir = path.resolve(__dirname, './upload')

/* 1.Written */
// 1.1.written CrawlFileRequestConfig string
async function writtenString() {
  const testXCrawl = xCrawl({ proxy: 'http://localhost:14892' })

  const res = await testXCrawl.crawlFile({
    requestConfig: requestConfig[0],
    fileConfig: { storeDir }
  })

  return res.isSuccess && res.data?.data.isSuccess
}

// 1.2.written CrawlFileRequestConfig FileRequestConfig
async function writtenFileRequestConfig() {
  const testXCrawl = xCrawl({ proxy: 'http://localhost:14892' })

  const res = await testXCrawl.crawlFile({
    requestConfig: { url: requestConfig[1] },
    fileConfig: { storeDir }
  })

  return res.isSuccess && res.data?.data.isSuccess
}

// 1.3.written CrawlFileRequestConfig (string | FileRequestConfig)[]
async function writtenStringAndFileRequestConfigArr() {
  const testXCrawl = xCrawl({ proxy: 'http://localhost:14892' })

  const res = await testXCrawl.crawlFile({
    requestConfig: [requestConfig[0], { url: requestConfig[1] }],
    fileConfig: { storeDir }
  })

  return res.reduce(
    (prev, item) => prev && item.isSuccess && !!item.data?.data.isSuccess,
    true
  )
}

/* 2.Loader Config */
// 2.1.Loader Base Config
async function loaderBaseConfig() {
  const testXCrawl = xCrawl({
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area',
    proxy: 'http://localhost:14892',
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testXCrawl.crawlFile({
    requestConfig: ['/4401.jpg', '/4403.jpg'],
    fileConfig: { storeDir }
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader API Config
async function loaderAPIConfig() {
  const testXCrawl = xCrawl({
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area'
  })

  const res = await testXCrawl.crawlFile({
    requestConfig: ['/4401.jpg', '/4403.jpg'],
    proxy: 'http://localhost:14892',
    timeout: 10000,
    fileConfig: { storeDir },
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

/* 3.Store Config */
async function storeConfig() {
  const testXCrawl = xCrawl({
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area',
    proxy: 'http://localhost:14892'
  })

  const record: string[] = []
  const res = await testXCrawl.crawlFile({
    requestConfig: [
      { url: '/4401.jpg', fileName: '4401' },
      { url: '/4403.jpg', fileName: '4403' }
    ],
    fileConfig: {
      storeDir: path.resolve(__dirname, './upload'),
      extension: '.jpg',
      beforeSave(info) {
        record.push(info.fileName)
      }
    }
  })

  let isSuccess = true
  res.forEach((item) => {
    if (isSuccess) {
      const hasName = record.includes(item.data?.data.fileName ?? '')
      isSuccess = item.isSuccess && hasName
    }
  })

  return isSuccess
}

/* 1.Written */
test('crawlFile - writtenString', async () => {
  console.log(
    chalk.bgGreen('================ crawlFile - writtenString ================')
  )
  await expect(writtenString()).resolves.toBe(true)
})

test('crawlFile - writtenFileRequestConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - writtenFileRequestConfig ================'
    )
  )
  await expect(writtenFileRequestConfig()).resolves.toBe(true)
})

test('crawlFile - writtenStringAndFileRequestConfigArr', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - writtenStringAndFileRequestConfigArr ================'
    )
  )
  await expect(writtenStringAndFileRequestConfigArr()).resolves.toBe(true)
})

/* 2.Loader Config */
test('crawlFile - loaderBaseConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - loaderBaseConfig ================'
    )
  )
  await expect(loaderBaseConfig()).resolves.toBe(true)
})

test('crawlFile - loaderAPIConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - loaderAPIConfig ================'
    )
  )
  await expect(loaderAPIConfig()).resolves.toBe(true)
})

/* 2.Store Config */
test('crawlFile - loaderAPIConfig', async () => {
  console.log(
    chalk.bgGreen('================ crawlFile - storeConfig ================')
  )
  await expect(storeConfig()).resolves.toBe(true)
})
