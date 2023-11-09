import xCrawl from 'x-crawl'

const testXCrawl = xCrawl()

testXCrawl.crawlHTML([
  'http://localhost:8888/html',
  'http://localhost:8888/html',
  'http://localhost:8888/html'
])

testXCrawl.crawlHTML('http://localhost:8888/html')

testXCrawl.crawlFile({
  targets: [
    'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg',
    'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4403.jpg'
  ],
  proxy: { urls: ['http://localhost:14892'] }
})
