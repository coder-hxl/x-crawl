import xCrawl from 'x-crawl'
import sharp from 'sharp'
import path from 'path'

const testXCrawl = xCrawl({
  enableRandomFingerprint: false,
  baseUrl:
    'https://raw.githubusercontent.com/coder-hxl/airbnb-upload/master/area',
  intervalTime: { max: 5000, min: 3000 }
})

testXCrawl
  .crawlFile({
    targets: ['/4401.jpg', '/4403.jpg', '/4404.jpg', '/4406.jpg', '/4407.jpg'],
    proxy: 'http://localhost:14892',
    headers: {
      test: 'test'
    },
    storeDir: path.resolve(__dirname, './upload'),
    onBeforeSaveFile(info) {
      return sharp(info.data).resize(200).toBuffer()
    },
    onCrawlItemComplete(crawlFileSingleRes) {
      // console.log(111, crawlFileSingleRes)
    }
  })
  .then(async (res) => {
    // console.log(res)

    res.forEach((item) => {
      console.log(item.data?.data.isSuccess)
    })
  })

// testXCrawl
//   .crawlPage({
//     targets: [
//       'https://github.com/coder-hxl',
//       {
//         url: 'https://github.com/coder-hxl/x-crawl',
//         fingerprint: null
//       },
//       {
//         url: 'https://github.com/coder-hxl/x-crawl/stargazers',
//         fingerprint: {
//           maxWidth: 1980,
//           minWidth: 1980,
//           maxHeight: 1080,
//           minHidth: 1080,
//           platform: 'Android'
//         }
//       }
//     ],
//     fingerprint: {
//       maxWidth: 1980,
//       maxHeight: 1080,
//       userAgents: [
//         'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
//         'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
//         'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
//         'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
//       ],
//       platforms: ['Chromium OS', 'iOS', 'Linux', 'macOS', 'Windows']
//     }
//   })
//   .then((res) => {
//     res.forEach((item, i) => {
//       item.data.page.screenshot({ path: `./img${i}.jpg` }).then(() => {
//         console.log(i, 'success')
//       })
//     })
//   })
