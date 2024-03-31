import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

async function testCrawlData() {
  const testCrawlApp = createCrawl()

  const res = await testCrawlApp.crawlData({
    targets: [
      'http://localhost:8888/data',
      { url: 'http://localhost:8888/data' }
    ]
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlData', async () => {
  console.log(chalk.bgGreen('================ crawlData ================'))
  await expect(testCrawlData()).resolves.toBe(true)
})
