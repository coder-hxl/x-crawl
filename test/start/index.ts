import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 2000 }
})

myXCrawl.crawlPage('https://www.bilibili.com/guochuang/').then(async (res) => {
  const { httpResponse, browser, page } = res

  console.log('status: ', httpResponse?.status())
})

myXCrawl.crawlPage('https://www.bilibili.com/guochuang/').then(async (res) => {
  const { httpResponse, page } = res

  console.log('status2: ', httpResponse?.status())

  myXCrawl
    .crawlPage('https://www.bilibili.com/guochuang/')
    .then(async (res) => {
      const { httpResponse, page } = res

      console.log('status4: ', httpResponse?.status())
    })
})

myXCrawl.crawlPage('https://www.bilibili.com/guochuang/').then(async (res) => {
  const { httpResponse, page } = res

  console.log('status3: ', httpResponse?.status())
})
