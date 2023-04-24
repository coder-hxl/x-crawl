import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import IXCrawl from '../../src'

const args = process.argv.slice(3)
const environment = args[0]

let xCrawl: typeof IXCrawl
if (environment === 'dev') {
  xCrawl = require('../../src').default
} else if (environment === 'pro') {
  xCrawl = require('../../publish/dist')
}

jest.setTimeout(60000)

async function async() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlData([
    'http://localhost:8888',
    'http://localhost:8888'
  ])

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

async function sync() {
  const testXCrawl = xCrawl({ mode: 'sync' })

  const res = await testXCrawl.crawlData([
    'http://localhost:8888',
    'http://localhost:8888'
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
