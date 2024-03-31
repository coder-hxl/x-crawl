import process from 'node:process'
import path from 'node:path'
import { expect, test, jest } from '@jest/globals'
import chalk from 'chalk'

import type * as XCrawl from 'x-crawl'

const args = process.argv.slice(3)
const environment = args[0]

const targetPath = environment === 'pro' ? 'publish/' : 'packages/'
const createCrawl = (require(targetPath) as typeof XCrawl).createCrawl

jest.setTimeout(60000)

const urls: string[] = [
  'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg',
  'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4403.jpg'
]

const storeDirs = path.resolve(__dirname, './upload')

async function testCrawlFile() {
  const testCrawlApp = createCrawl({
    proxy: { urls: ['http://localhost:14892'] }
  })

  const res = await testCrawlApp.crawlFile({
    targets: urls,
    storeDirs
  })

  return res.reduce(
    (prev, item) => prev && item.isSuccess && !!item.data?.data.isSuccess,
    true
  )
}

test('crawlFile', async () => {
  console.log(chalk.bgGreen('================ crawlFile ================'))
  await expect(testCrawlFile()).resolves.toBe(true)
})
