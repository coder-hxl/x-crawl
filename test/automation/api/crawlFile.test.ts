import path from 'node:path'
import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

const urls: string[] = [
  'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area/4401.jpg',
  'https://raw.githubusercontent.com/coder-hxl/example-upload/master/area/4403.jpg'
]

const storeDirs = path.resolve(__dirname, './upload')

async function testCrawlFile() {
  const testCrawlApp = createCrawl({
    log: false,
    proxy: { urls: ['http://localhost:7890'] }
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
  await expect(testCrawlFile()).resolves.toBe(true)
})
