import process from 'node:process'
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

/* 1.Written */
// 1.1.written string
async function writtenString() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData(
    'http://localhost:9001/api/room/193581217'
  )

  return res.isSuccess
}

// 1.2.written CrawlDataDetailConfig
async function writtenCrawlDataDetailConfig() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData({
    url: 'http://localhost:9001/api/room/193581217'
  })

  return res.isSuccess
}

// 1.3.written (string | CrawlDataDetailConfig)[]
async function writtenStringAndCrawlDataDetailConfigArr() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData([
    'http://localhost:9001/api/room/193581217',
    { url: 'http://localhost:9001/api/room/193581217' }
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 1.4.written CrawlDataAdvancedConfig
async function writtenCrawlDataAdvancedConfig() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData({
    targets: [
      'http://localhost:9001/api/room/193581217',
      { url: 'http://localhost:9001/api/room/193581217' }
    ]
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

/* 2.Loader Config */
// 2.1.Loader Base Config
async function loaderBaseConfig() {
  const testXCrawl = xCrawl({
    baseUrl: 'http://localhost:9001/api',
    proxy: 'http://localhost:14892',
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testXCrawl.crawlData(['/room/193581217', '/room/193581217'])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader Advanced Config
async function loaderAdvancedConfig() {
  const testXCrawl = xCrawl({
    baseUrl: 'http://localhost:9001/api'
  })

  const res = await testXCrawl.crawlData({
    targets: ['/room/193581217', '/room/193581217'],
    proxy: 'http://localhost:14892',
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlData - writtenString', async () => {
  console.log(
    chalk.bgGreen('================ crawlData - writtenString ================')
  )
  await expect(writtenString()).resolves.toBe(true)
})

test('crawlData - writtenCrawlDataDetailConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - writtenCrawlDataDetailConfig ================'
    )
  )
  await expect(writtenCrawlDataDetailConfig()).resolves.toBe(true)
})

test('crawlData - writtenStringAndCrawlDataDetailConfigArr', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - writtenStringAndCrawlDataDetailConfigArr ================'
    )
  )
  await expect(writtenStringAndCrawlDataDetailConfigArr()).resolves.toBe(true)
})

test('crawlData - writtenCrawlDataAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - writtenCrawlDataAdvancedConfig ================'
    )
  )
  await expect(writtenCrawlDataAdvancedConfig()).resolves.toBe(true)
})

/* 2.Loader Config */
test('crawlData - loaderBaseConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - loaderBaseConfig ================'
    )
  )
  await expect(loaderBaseConfig()).resolves.toBe(true)
})

test('crawlData - loaderAdvancedConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - loaderAdvancedConfig ================'
    )
  )
  await expect(loaderAdvancedConfig()).resolves.toBe(true)
})
