// 1.Import module ES/CJS
import xCrawl from 'x-crawl'

// 2.Create a crawler instance
const myXCrawl = xCrawl({ maxRetry: 3, intervalTime: { max: 3000, min: 2000 } })

// 3.Set the crawling task
/*
  Call the startPolling API to start the polling function,
  and the callback function will be called every other day
*/
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // Call crawlPage API to crawl Page
  const res = await myXCrawl.crawlPage([
    'https://zh.airbnb.com/s/hawaii/experiences',
    'https://zh.airbnb.com/s/hawaii/plus_homes'
  ])

  // Store the image URL
  const imgUrls: string[] = []
  const elSelectorMap = ['.c14whb16', '.a1stauiv']
  for (const item of res) {
    const { id } = item
    const { page } = item.data

    // Gets the URL of the page's wheel image element
    const boxHandle = await page.$(elSelectorMap[id - 1])
    const urls = await boxHandle!.$$eval('picture img', (imgEls) => {
      return imgEls.map((item) => item.src)
    })
    imgUrls.push(...urls)

    // Close page
    page.close()
  }

  // Call the crawlFile API to crawl pictures
  myXCrawl.crawlFile({
    requestConfigs: imgUrls,
    fileConfig: { storeDir: './upload' }
  })
})
