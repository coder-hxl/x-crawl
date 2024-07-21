import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

async function proxy() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlPage({
    targets: ['https://', 'http://localhost:8888/html'],
    maxRetry: 3,
    proxy: {
      urls: ['http://localhost:129032', 'http://localhost:7890'],
      switchByErrorCount: 2
    }
  })

  await res[0].data.browser.close()

  return (
    res[0].proxyDetails[0].state === false &&
    res[1].isSuccess &&
    res[1].proxyDetails[1].state === true
  )
}

test('proxy', async () => {
  await expect(proxy()).resolves.toBe(true)
})
