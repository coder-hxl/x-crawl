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

async function testCrawlHTML() {
  const testXCrawl = xCrawl({ proxy: { urls: ['http://localhost:14892'] } })

  const res = await testXCrawl.crawlHTML({
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
