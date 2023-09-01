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

async function errorCollect() {
  const testXCrawl = xCrawl({ maxRetry: 2 })

  const res = await testXCrawl.crawlPage(['https://', 'https://', 'https://'])

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
