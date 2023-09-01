import process from 'node:process'
import path from 'node:path'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from 'src/'

const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('src/').default
} else if (environment === 'pro') {
  xCrawl = require('publish/')
}

jest.setTimeout(60000)

const urls: string[] = [
  'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg',
  'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4403.jpg'
]

const storeDirs = path.resolve(__dirname, './upload')

/* 1.Written */
// 1.1.written CrawlFileDetailConfig
async function writtenCrawlFileDetailConfig() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlFile({ url: urls[0], storeDir: storeDirs })

  return res.isSuccess && res.data?.data.isSuccess
}

// 1.2.written CrawlFileDetailConfig[]
async function writtenCrawlFileDetailConfigArr() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlFile(
    urls.map((url) => ({ url, storeDir: storeDirs }))
  )

  return res.reduce(
    (prev, item) => prev && item.isSuccess && !!item.data?.data.isSuccess,
    true
  )
}

// 1.3.written CrawlFileAdvancedConfig
async function writtenCrawlFileAdvancedConfig() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlFile({
    targets: urls,
    storeDirs
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
    proxy: { urls: ['http://localhost:14892'] },
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testXCrawl.crawlFile({
    targets: ['/4401.jpg', '/4403.jpg'],
    storeDirs
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader Advanced Config
async function loaderAdvancedConfig() {
  const testXCrawl = xCrawl({
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area'
  })

  const res = await testXCrawl.crawlFile({
    targets: ['/4401.jpg', '/4403.jpg'],
    proxy: { urls: ['http://localhost:14892'] },
    timeout: 10000,
    storeDirs,
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
    proxy: { urls: ['http://localhost:14892'] }
  })

  const record: string[] = []
  const res = await testXCrawl.crawlFile({
    targets: [
      { url: '/4401.jpg', fileName: '4401' },
      { url: '/4403.jpg', fileName: '4403' }
    ],
    storeDirs: path.resolve(__dirname, './upload'),
    extensions: '.jpg',
    async onBeforeSaveItemFile(info) {
      record.push(info.fileName)
      return info.data
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
test('crawlFile - writtenCrawlFileDetailConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - writtenCrawlFileDetailConfig ================'
    )
  )
  await expect(writtenCrawlFileDetailConfig()).resolves.toBe(true)
})

test('crawlFile - writtenCrawlFileDetailConfigArr', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - writtenCrawlFileDetailConfigArr ================'
    )
  )
  await expect(writtenCrawlFileDetailConfigArr()).resolves.toBe(true)
})

test('crawlFile - writtenCrawlFileAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - writtenCrawlFileAdvancedConfig ================'
    )
  )
  await expect(writtenCrawlFileAdvancedConfig()).resolves.toBe(true)
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

test('crawlFile - loaderAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlFile - loaderAdvancedConfig ================'
    )
  )
  await expect(loaderAdvancedConfig()).resolves.toBe(true)
})

/* 2.Store Config */
test('crawlFile - loaderAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen('================ crawlFile - storeConfig ================')
  )
  await expect(storeConfig()).resolves.toBe(true)
})
