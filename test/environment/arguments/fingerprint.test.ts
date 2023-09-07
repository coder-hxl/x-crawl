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

async function fingerprint() {
  const testXCrawl = xCrawl()

  const res = await testXCrawl.crawlPage({
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
  console.log(chalk.bgGreen('================ fingerprint ================'))
  await expect(fingerprint()).resolves.toBe(true)
})
