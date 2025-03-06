import path from 'node:path'
import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

const urls: string[] = [
  'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area/4401.jpg',
  'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area/4403.jpg'
]

const storeDirs = path.resolve(__dirname, './upload')

/* 1.Written */
// 1.1.written CrawlFileDetailConfig
async function writtenCrawlFileDetailConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:7890'] }
  })

  const res = await testCrawlApp.crawlFile({
    url: urls[0],
    storeDir: storeDirs
  })

  return res.isSuccess && res.data?.data.isSuccess
}

// 1.2.written CrawlFileDetailConfig[]
async function writtenCrawlFileDetailConfigArr() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:7890'] }
  })

  const res = await testCrawlApp.crawlFile(
    urls.map((url) => ({ url, storeDir: storeDirs }))
  )

  return res.reduce(
    (prev, item) => prev && item.isSuccess && !!item.data?.data.isSuccess,
    true
  )
}

// 1.3.written CrawlFileAdvancedConfig
async function writtenCrawlFileAdvancedConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:7890'] }
  })

  const res = await testCrawlApp.crawlFile({
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
  const testCrawlApp = createCrawl({
    log: false,
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area',
    proxy: { urls: ['http://localhost:7890'] },
    timeout: 10000,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  const res = await testCrawlApp.crawlFile({
    targets: ['/4401.jpg', '/4403.jpg'],
    storeDirs
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

// 2.2.Loader Advanced Config
async function loaderAdvancedConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area'
  })

  const res = await testCrawlApp.crawlFile({
    targets: ['/4401.jpg', '/4403.jpg'],
    proxy: { urls: ['http://localhost:7890'] },
    timeout: 10000,
    storeDirs,
    intervalTime: { max: 1000 },
    maxRetry: 0
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

/* 3.Store Config */
async function storeConfig() {
  const testCrawlApp = createCrawl({
    log: false,
    baseUrl:
      'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area',
    proxy: { urls: ['http://localhost:7890'] }
  })

  const record: string[] = []
  const res = await testCrawlApp.crawlFile({
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
  await expect(writtenCrawlFileDetailConfig()).resolves.toBe(true)
})

test('crawlFile - writtenCrawlFileDetailConfigArr', async () => {
  await expect(writtenCrawlFileDetailConfigArr()).resolves.toBe(true)
})

test('crawlFile - writtenCrawlFileAdvancedConfig', async () => {
  await expect(writtenCrawlFileAdvancedConfig()).resolves.toBe(true)
})

/* 2.Loader Config */
test('crawlFile - loaderBaseConfig', async () => {
  await expect(loaderBaseConfig()).resolves.toBe(true)
})

test('crawlFile - loaderAdvancedConfig', async () => {
  await expect(loaderAdvancedConfig()).resolves.toBe(true)
})

/* 2.Store Config */
test('crawlFile - loaderAdvancedConfig', async () => {
  await expect(storeConfig()).resolves.toBe(true)
})
