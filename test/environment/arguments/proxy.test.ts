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
  xCrawl = require('publish/dist')
}

jest.setTimeout(60000)

async function proxy() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlPage({
    targets: ['https://', 'https://github.com/coder-hxl'],
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
