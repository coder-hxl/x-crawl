import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

/* 1.Written */
// 1.1.written string
async function writtenString() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlHTML('http://localhost:8888/html')

  return res.isSuccess
}

// 1.2.written CrawlHTMLDetailConfig
async function writtenCrawlHTMLDetailConfig() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlHTML({
    url: 'http://localhost:8888/html'
  })

  return res.isSuccess
}

// 1.3.written (string | CrawlHTMLDetailConfig)[]
async function writtenStringAndCrawlHTMLDetailConfigArr() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlHTML([
    'http://localhost:8888/html',
    { url: 'http://localhost:8888/html' }
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 1.4.written CrawlHTMLAdvancedConfig
async function writtenCrawlHTMLAdvancedConfig() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlHTML({
    targets: [
      'http://localhost:8888/html',
      { url: 'http://localhost:8888/html' }
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

  const res = await testCrawlApp.crawlHTML(['/html', '/html'])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader Advanced Config
async function loaderAdvancedConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    baseUrl: 'http://localhost:8888'
  })

  const res = await testCrawlApp.crawlHTML({
    targets: ['/html', '/html'],
    proxy: { urls: ['http://localhost:14892'] },
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlHTML - writtenString', async () => {
  await expect(writtenString()).resolves.toBe(true)
})

test('crawlHTML - writtenCrawlHTMLDetailConfig', async () => {
  await expect(writtenCrawlHTMLDetailConfig()).resolves.toBe(true)
})

test('crawlHTML - writtenStringAndCrawlHTMLDetailConfigArr', async () => {
  await expect(writtenStringAndCrawlHTMLDetailConfigArr()).resolves.toBe(true)
})

test('crawlHTML - writtenCrawlHTMLAdvancedConfig', async () => {
  await expect(writtenCrawlHTMLAdvancedConfig()).resolves.toBe(true)
})

/* 2.Loader Config */
test('crawlHTML - loaderBaseConfig', async () => {
  await expect(loaderBaseConfig()).resolves.toBe(true)
})

test('crawlHTML - loaderAdvancedConfig', async () => {
  await expect(loaderAdvancedConfig()).resolves.toBe(true)
})
