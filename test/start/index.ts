import xCrawl from 'x-crawl'
import sharp from 'sharp'
import path from 'path'

const testXCrawl = xCrawl({ maxRetry: 2 })

testXCrawl.crawlData(['https://', 'https://', 'https://']).then((res) => {
  console.log(res)
})
