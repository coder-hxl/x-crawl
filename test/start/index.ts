import xCrawl from 'x-crawl'
import sharp from 'sharp'
import path from 'path'

const testXCrawl = xCrawl({
  intervalTime: { max: 5000, min: 3000 }
})

// testXCrawl.crawlPage({
//   targets: [
//     'https://github.com/coder-hxl',
//     { url: 'https://github.com/coder-hxl/x-crawl', fingerprint: null },
//     {
//       url: 'https://github.com/coder-hxl/x-crawl/stargazers',
//       fingerprint: {
//         platform: 'Windows',
//         mobile: 'random',
//         userAgent: {
//           value:
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
//           versions: [
//             {
//               name: 'Chrome',
//               maxMajorVersion: 91,
//               minMajorVersion: 88,
//               maxMinorVersion: 10,
//               maxPatchVersion: 5615
//             },
//             { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 },
//             { name: 'Edg', maxMinorVersion: 10, maxPatchVersion: 864 }
//           ]
//         }
//       }
//     }
//   ],
//   fingerprints: [
//     {
//       platform: 'Windows',
//       mobile: 'random',
//       userAgent: {
//         value:
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
//         versions: [
//           {
//             name: 'Chrome',
//             maxMajorVersion: 112,
//             minMajorVersion: 100,
//             maxMinorVersion: 20,
//             maxPatchVersion: 5000
//           },
//           {
//             name: 'Safari',
//             maxMajorVersion: 537,
//             minMajorVersion: 500,
//             maxMinorVersion: 36,
//             maxPatchVersion: 5000
//           }
//         ]
//       }
//     }
//   ]
// })

testXCrawl
  .crawlPage({
    targets: ['https://www.google.com', 'https://github.com/coder-hxl'],
    proxy: {
      urls: ['http://localhost:14897', 'http://localhost:14892'],
      switchByErrorCount: 1
    },
    maxRetry: 3
  })
  .then((res) => {
    console.log('================== res ==================')
    console.log(res)

    res.forEach((item, i) => {
      console.log(item.proxyDetails)
      // item.data.page.screenshot({ path: `${i}page.jpg` })
    })

    res[0].data.browser.close()
  })
