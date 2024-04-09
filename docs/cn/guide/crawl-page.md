# 爬取页面

通过 [crawlPage()](/cn/api/crawl-page#crawlpage) 爬取一个页面。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // 关闭浏览器
  browser.close()
})
```

## browser 实例

当你在同个爬虫实例调用 crawlPage API 进行爬取页面时，所用的 browser 实例都是同一个，因为 browser 实例在同个爬虫实例中的 crawlPage API 是共享的。具体使用可以参考 [Browser](https://pptr.dev/api/puppeteer.browser) 。

::: warning
browser 会一直保持着运行，造成文件不会终止，如果想停止可以执行 browser.close() 关闭。如果后面还需要用到 [crawlPage](#爬取页面) 或者 [page](#page-实例) 请勿调用。因为 browser 实例在同个爬虫实例中的 crawlPage API 是共享的。
:::

## page 实例

当你在同个爬虫实例调用 crawlPage API 进行爬取页面时，都会从 browser 实例中产生一个新的 page 实例。具体使用可以参考 [Page](https://pptr.dev/api/puppeteer.page) 。

::: warning
如果后续不再使用 page 需要自行调用 page.close() 关闭 page 实例，否则会造成内存泄露。
:::

## 生命周期

crawlPage API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。

## 示例

**打开浏览器**

取消以无头模式运行浏览器。

```js{6}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  maxRetry: 3,
  // 取消以无头模式运行浏览器
  crawlPage: { puppeteerLaunchOptions: { headless: false } }
})

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

**获取屏幕截图**

```js{9}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then(async (res) => {
  const { browser, page } = res.data

  // 获取页面渲染后的截图
  await page.screenshot({ path: './upload/page.png' })

  console.log('获取屏幕截图完毕')

  browser.close()
})
```
