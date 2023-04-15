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

// 1.2.written DataRequestConfig
async function writtenDataRequestConfig() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData({
    url: 'http://localhost:9001/api/room/193581217'
  })

  return res.isSuccess
}

// 1.3.written (string | DataRequestConfig)[]
async function writtenStringAndDataRequestConfigArr() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData([
    'http://localhost:9001/api/room/193581217',
    { url: 'http://localhost:9001/api/room/193581217' }
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 1.4.written CrawlDataConfigObject
async function writtenCrawlDataConfigObject() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData({
    crawlDatas: [
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

// 2.2.Loader API Config
async function loaderAPIConfig() {
  const testXCrawl = xCrawl({
    baseUrl: 'http://localhost:9001/api'
  })

  const res = await testXCrawl.crawlData({
    crawlDatas: ['/room/193581217', '/room/193581217'],
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

test('crawlData - writtenDataRequestConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - writtenDataRequestConfig ================'
    )
  )
  await expect(writtenDataRequestConfig()).resolves.toBe(true)
})

test('crawlData - writtenStringAndDataRequestConfigArr', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - writtenStringAndDataRequestConfigArr ================'
    )
  )
  await expect(writtenStringAndDataRequestConfigArr()).resolves.toBe(true)
})

test('crawlData - writtenCrawlDataConfigObject', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - writtenCrawlDataConfigObject ================'
    )
  )
  await expect(writtenCrawlDataConfigObject()).resolves.toBe(true)
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

test('crawlData - loaderAPIConfig', async () => {
  console.log(
    chalk.bgGreen(
      '================ crawlData - loaderAPIConfig ================'
    )
  )
  await expect(loaderAPIConfig()).resolves.toBe(true)
})
