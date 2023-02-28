import path from 'node:path'
import xCrawl from '../../src'

// const testXCrawl = xCrawl({
//   timeout: 10000,
//   intervalTime: { max: 3000, min: 1000 },
//   mode: 'async'
// })

// testXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
//   const { jsdom } = res.data

//   const imgEls =
//     jsdom.window.document.querySelectorAll<HTMLImageElement>(
//       '.timeline-box img'
//     )

//   let requestConfig: any[] = []

//   imgEls.forEach((item) => requestConfig.push({ url: `https:${item.src}` }))

//   requestConfig = requestConfig.splice(0, 30)

//   console.log(requestConfig)

//   testXCrawl.fetchFile({
//     requestConfig,
//     fileConfig: { storeDir: path.resolve(__dirname, 'upload') }
//   })
// })
