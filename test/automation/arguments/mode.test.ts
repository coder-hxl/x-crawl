import process from 'node:process'
import { expect, test } from 'vitest'

import * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = ((await import(targetPath)) as typeof XCrawl).createCrawl

async function async() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    'http://localhost:8888/data'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

async function sync() {
  const testCrawlApp = createCrawl({ log: false, mode: 'sync' })

  const res = await testCrawlApp.crawlData([
    'http://localhost:8888/data',
    'http://localhost:8888/data'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('mode - async', async () => {
  await expect(async()).resolves.toBe(true)
})

test('mode - sync', async () => {
  await expect(sync()).resolves.toBe(true)
})
