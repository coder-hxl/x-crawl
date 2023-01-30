import XCrawl from '../../src'

const testXCrawl = new XCrawl({
  baseUrl: 'http://localhost:9001/api',
  timeout: 10000,
  intervalTime: {
    max: 3000,
    min: 1000
  }
})

testXCrawl
  .fetchData({
    requestConifg: {
      url: '/home/goodprice',
      method: 'POST'
    }
  })
  .then((res) => {
    console.log(res)
  })
