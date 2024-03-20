import path from 'node:path'
import xCrawl from 'x-crawl'

const pathResolve = (dirPath: string) => path.resolve(__dirname, dirPath)

const testXCrawl = xCrawl()

testXCrawl
  .crawlFile({
    targets: [
      {
        url: 'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4408.jpg',
        fileName: '4408',
        priority: 1
      },
      {
        url: 'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4401.jpg',
        fileName: '4401',
        priority: 3
      },
      {
        url: 'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4406.jpg',
        fileName: '4406',
        priority: 2
      }
    ],
    proxy: { urls: ['http://localhost:14892'] },
    storeDirs: pathResolve('./upload')
  })
  .then((res) => {
    res.forEach((item) => {
      console.log(item.id, item.data?.data.fileName)
    })
  })
