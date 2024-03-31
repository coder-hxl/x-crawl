import process from 'node:process'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

async function proxy() {
  const testCrawlApp = createCrawl()

  const res = await testCrawlApp.crawlPage({
    targets: ['https://', 'http://localhost:8888/html'],
    maxRetry: 3,
    proxy: {
      urls: ['http://localhost:129032', 'http://localhost:14892'],
      switchByErrorCount: 2
    }
  })

  await res[0].data.browser.close()

  return (
    res[0].proxyDetails[0].state === false &&
    res[1].isSuccess &&
    res[1].proxyDetails[1].state === true
  )
}

test('proxy', async () => {
  console.log(chalk.bgGreen('================ proxy ================'))
  await expect(proxy()).resolves.toBe(true)
})
