import process from 'node:process'
import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = ((await import(targetPath)) as typeof XCrawl).createCrawl

async function errorCollect() {
  const testCrawlApp = createCrawl({ log: false, maxRetry: 2 })

  const res = await testCrawlApp.crawlPage(['https://', 'https://', 'https://'])

  await res[0].data.browser.close()

  const errorCount = res.reduce(
    (prev, curr) => prev + curr.crawlErrorQueue.length,
    0
  )

  return errorCount === 9
}

test('errorCollect', async () => {
  await expect(errorCollect()).resolves.toBe(true)
})
