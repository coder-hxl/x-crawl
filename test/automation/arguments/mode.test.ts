import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

async function async() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    'http://localhost:8888/data'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

async function sync() {
  const testCrawlApp = createCrawl({ log: false, mode: 'sync' })

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    'http://localhost:8888/data'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('mode - async', async () => {
  await expect(async()).resolves.toBe(true)
})

test('mode - sync', async () => {
  await expect(sync()).resolves.toBe(true)
})
