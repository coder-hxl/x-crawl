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

async function testCrawlData() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData({
    targets: ['http://localhost:8888', { url: 'http://localhost:8888' }]
  })

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('crawlData', async () => {
  console.log(chalk.bgGreen('================ crawlData ================'))
  await expect(testCrawlData()).resolves.toBe(true)
})
