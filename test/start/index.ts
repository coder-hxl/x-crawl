import xCrawl from 'x-crawl'

const testXCrawl = xCrawl()

testXCrawl
  .crawlData({
    url: 'http://localhost:8888',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: { name: 'hxl', age: 19 }
  })
  .then((res) => {
    console.log(res)
  })
