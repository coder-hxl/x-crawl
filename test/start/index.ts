import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  baseUrl: 'http://localhost:9001/api',
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

testXCrawl
  .crawlData({
    requestConfigs: [
      { url: '/room/597664', priority: 3 },
      { url: '/room/92507', priority: 8 },
      { url: '/room/193581217', priority: 3 }
    ]
  })
  .then((res) => {
    res.forEach((item) => {
      console.log(item.data?.data.data.id)
    })
  })
