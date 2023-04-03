import path from 'node:path'
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 },
  proxy: 'http://localhost:14892'
})

// testXCrawl
//   .crawlData({
//     requestConfigs: [
//       { url: '/room/597664', priority: 3 },
//       { url: '/room/92507', priority: 8 },
//       { url: '/room/193581217', priority: 3 }
//     ]
//   })
//   .then((res) => {
//     res.forEach((item) => {
//       console.log(item.data?.data.data.id)
//     })
//   })

testXCrawl
  .crawlFile({
    requestConfig: [
      {
        url: 'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area/4403.jpg',
        fileName: '4403',
        extension: '.jpg'
      },
      {
        url: 'http://127.0.0.1:5500/assets/cn/crawler.png',
        fileName: 'crawler',
        storeDir: path.resolve(__dirname, './upload/2/1')
      }
    ],
    fileConfig: {
      storeDir: path.resolve(__dirname, './upload'),
      beforeSave(info) {
        console.log(info.fileName, info.filePath)
      }
    }
  })
  .then((res) => {
    res.forEach((item) => {
      console.log(item.id)

      item.errorQueue.forEach((item) => console.log(item.message))
    })
  })
