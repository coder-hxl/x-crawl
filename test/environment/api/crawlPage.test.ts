import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from 'src/'

const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('src/').default
} else if (environment === 'pro') {
  xCrawl = require('publish/')
}

jest.setTimeout(60000)

async function testCrawlPage() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlPage({
    targets: [
      'https://github.com/coder-hxl/x-crawl',
      { url: 'https://github.com/coder-hxl/x-crawl' }
    ]
  })

  await res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlPage', async () => {
  console.log(chalk.bgGreen('================ crawlPage ================'))
  await expect(testCrawlPage()).resolves.toBe(true)
})
