import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

async function testCrawlPage() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:14892'] }
  })

  const res = await testCrawlApp.crawlPage({
    targets: [
      'http://localhost:8888/html',
      { url: 'http://localhost:8888/html' }
    ]
  })

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlPage', async () => {
  await expect(testCrawlPage()).resolves.toBe(true)
})
