import process from 'node:process'
import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = ((await import(targetPath)) as typeof XCrawl).createCrawl

console.log(`${environment}:${targetPath}`, createCrawl)

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
