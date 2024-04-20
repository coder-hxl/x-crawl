# 常见问题 {#common-problem}

## crawlPage API 跟 puppeteer 的关系 {#the-relationship-between-crawlpage-api-and-puppeteer}

crawlPage API 内置了 [puppeteer](https://github.com/puppeteer/puppeteer) ，您只需要传入一些配置选项即可让 x-crawl 帮助您简化操作，并拿到完好无损的 Brower 实例和 Page 实例，x-crawl 并不会对其重写。

## 使用 crawlPage API 造成程序崩溃 {#using-crawlpage-api-causes-the-program-to-crash}

如果你需要在一个 crawlPage 爬取很多页面，建议在每个页面爬下来后，用 [onCrawlItemComplete 生命周期函数](/cn/guide/crawl-page#生命周期) 来处理每个目标的结果并关闭 page 实例，如果不进行关闭操作，则可能因开启的 page 过多而造成程序崩溃（跟自身设备性能有关）。

```js{11,12,13,14,15,16,,17,,18,35,36,37,38,39,40}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// 爬取目标少的推荐
crawlApp
  .crawlPage([
    'https://www.example.com/page-1',
    'https://www.example.com/page-2'
  ])
  .then((results) => {
    for (const itemResult of results) {
      const { page } = itemResult.data

      // 后续不再使用就关闭
      page.close()
    }
  })

// 爬取目标多的推荐
// 通过进阶配置的 onCrawlItemComplete
crawlApp.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    'https://www.example.com/page-2',
    'https://www.example.com/page-3',
    'https://www.example.com/page-4',
    'https://www.example.com/page-5',
    'https://www.example.com/page-6',
    'https://www.example.com/page-7',
    'https://www.example.com/page-8',
    'https://www.example.com/page-9',
    'https://www.example.com/page-10'
  ],
  onCrawlItemComplete(crawlPageSingleResult) {
    const { page } = crawlPageSingleResult.data

    // 后续不再使用就关闭
    page.close()
  }
})
```
