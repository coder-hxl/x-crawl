import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

async function testCrawlPage() {
  const testCrawlApp = createCrawl({
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
  console.log(chalk.bgGreen('================ crawlPage ================'))
  await expect(testCrawlPage()).resolves.toBe(true)
})
