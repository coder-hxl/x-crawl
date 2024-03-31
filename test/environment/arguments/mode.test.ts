import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

async function async() {
  const testCrawlApp = createCrawl()

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    'http://localhost:8888/data'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

async function sync() {
  const testCrawlApp = createCrawl({ mode: 'sync' })

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    'http://localhost:8888/data'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('mode - async', async () => {
  console.log(chalk.bgGreen('================ mode - async ================'))
  await expect(async()).resolves.toBe(true)
})

test('mode - sync', async () => {
  console.log(chalk.bgGreen('================ mode - sync ================'))
  await expect(sync()).resolves.toBe(true)
})
