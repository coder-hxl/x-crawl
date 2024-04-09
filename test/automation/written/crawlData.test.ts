import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

/* 1.Written */
// 1.1.written string
async function writtenString() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData('http://localhost:8888/data')

  return res.isSuccess
}

// 1.2.written CrawlDataDetailConfig
async function writtenCrawlDataDetailConfig() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData({
    url: 'http://localhost:8888/data'
  })

  return res.isSuccess
}

// 1.3.written (string | CrawlDataDetailConfig)[]
async function writtenStringAndCrawlDataDetailConfigArr() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    { url: 'http://localhost:8888/data' }
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 1.4.written CrawlDataAdvancedConfig
async function writtenCrawlDataAdvancedConfig() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData({
    targets: [
      'http://localhost:8888/data',
      { url: 'http://localhost:8888/data' }
    ]
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

/* 2.Loader Config */
// 2.1.Loader Base Config
async function loaderBaseConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    baseUrl: 'http://localhost:8888',
    proxy: { urls: ['http://localhost:14892'] },
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testCrawlApp.crawlData(['/data', '/data'])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader Advanced Config
async function loaderAdvancedConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    baseUrl: 'http://localhost:8888'
  })

  const res = await testCrawlApp.crawlData({
    targets: ['/data', '/data'],
    proxy: { urls: ['http://localhost:14892'] },
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlData - writtenString', async () => {
  await expect(writtenString()).resolves.toBe(true)
})

test('crawlData - writtenCrawlDataDetailConfig', async () => {
  await expect(writtenCrawlDataDetailConfig()).resolves.toBe(true)
})

test('crawlData - writtenStringAndCrawlDataDetailConfigArr', async () => {
  await expect(writtenStringAndCrawlDataDetailConfigArr()).resolves.toBe(true)
})

test('crawlData - writtenCrawlDataAdvancedConfig', async () => {
  await expect(writtenCrawlDataAdvancedConfig()).resolves.toBe(true)
})

/* 2.Loader Config */
test('crawlData - loaderBaseConfig', async () => {
  await expect(loaderBaseConfig()).resolves.toBe(true)
})

test('crawlData - loaderAdvancedConfig', async () => {
  await expect(loaderAdvancedConfig()).resolves.toBe(true)
})
