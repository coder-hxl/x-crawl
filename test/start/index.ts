import xCrawl from 'x-crawl'

const testXCrawl = xCrawl()

testXCrawl.crawlHTML('http://localhost:8888/html').then((res) => {
  console.log(res.data?.html)
})
