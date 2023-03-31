import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

testXCrawl
  .crawlData({
    requestConfig: {
      url: 'http://localhost:9001/api/area/阳江市',
      method: 'POST',
      data: {
        type: 'goodPrice',
        offset: 0,
        size: 20
      }
    }
  })
  .then((res) => {
    if (res.data?.statusCode === 200) {
      return true
    } else {
      return false
    }
  })
