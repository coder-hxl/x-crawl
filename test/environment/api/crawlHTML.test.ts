import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

async function testCrawlHTML() {
  const testCrawlApp = createCrawl({
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
  console.log(chalk.bgGreen('================ crawlHTML ================'))
  await expect(testCrawlHTML()).resolves.toBe(true)
})
