import { expect, test } from 'vitest'

import type * as XCrawl from 'x-crawl'

const createCrawl = (
  (await import(__DEV__ ? 'packages/' : 'publish/')) as typeof XCrawl
).createCrawl

async function fingerprint() {
  const testCrawlApp = createCrawl({ log: false })

  const res = await testCrawlApp.crawlPage({
    targets: [
      'http://localhost:8888/html',
      { url: 'http://localhost:8888/html', fingerprint: null },
      {
        url: 'http://localhost:8888/html',
        fingerprint: {
          maxWidth: 1024,
          maxHeight: 800,
          ua: `Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99`,
          mobile: 'random',
          platform: 'Windows',
          platformVersion: '10',
          acceptLanguage: `zh-CN,zh;q=0.9,en;q=0.8`,
          userAgent: {
            value:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            versions: [
              {
                name: 'Chrome',
                maxMinorVersion: 10,
                maxPatchVersion: 5615
              },
              { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 }
            ]
          }
        }
      }
    ],
    fingerprints: [
      {
        platform: 'Windows',
        mobile: 'random',
        userAgent: {
          value:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
          versions: [
            {
              name: 'Chrome',
              maxMajorVersion: 112,
              minMajorVersion: 100,
              maxMinorVersion: 20,
              maxPatchVersion: 5000
            },
            {
              name: 'Safari',
              maxMajorVersion: 537,
              minMajorVersion: 500,
              maxMinorVersion: 36,
              maxPatchVersion: 5000
            }
          ]
        }
      }
    ]
  })

  res[0].data.browser.close()

  return res.reduce((prev, item) => prev && item.isSuccess, true)
}

test('fingerprint', async () => {
  await expect(fingerprint()).resolves.toBe(true)
})
