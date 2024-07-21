import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

async function testCrawlHTML() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:7890'] }
  })

  const res = await testCrawlApp.crawlHTML({
    targets: [
      'http://localhost:8888/html',
      { url: 'http://localhost:8888/html' }
    ]
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlHTML', async () => {
  await expect(testCrawlHTML()).resolves.toBe(true)
})
