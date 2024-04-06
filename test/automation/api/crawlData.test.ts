import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

async function testCrawlData() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData({
    targets: [
      'http://localhost:8888/data',
      { url: 'http://localhost:8888/data' }
    ]
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlData', async () => {
  await expect(testCrawlData()).resolves.toBe(true)
})
