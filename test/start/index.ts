import path from 'node:path'
import { Browser } from 'puppeteer'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

testXCrawl
  .crawlPage({
    requestConfigs: [
      'https://www.google.com/search?q=1',
      'https://www.google.com/search?q=2',
      'https://www.google.com/search?q=2'
    ],
    maxRetry: 2
  })
  .then((res) => {
    let browser: Browser | null = null

    res.forEach((item) => {
      if (!browser) browser = item.data.browser

      console.log(item.isSuccess, item.retryCount)

      console.log(item.errorQueue.map((item) => item.message))
    })

    browser!.close()
  })
