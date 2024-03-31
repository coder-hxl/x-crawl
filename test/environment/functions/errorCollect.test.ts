import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

async function errorCollect() {
  const testCrawlApp = createCrawl({ maxRetry: 2 })

  const res = await testCrawlApp.crawlPage(['https://', 'https://', 'https://'])

  await res[0].data.browser.close()

  const errorCount = res.reduce(
    (prev, curr) => prev + curr.crawlErrorQueue.length,
    0
  )

  return errorCount === 9
}

test('errorCollect', async () => {
  console.log(chalk.bgGreen('================ errorCollect ================'))
  await expect(errorCollect()).resolves.toBe(true)
})
