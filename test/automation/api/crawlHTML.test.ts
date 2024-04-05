import process from 'node:process'
import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = ((await import(targetPath)) as typeof XCrawl).createCrawl

async function testCrawlHTML() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:14892'] }
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
