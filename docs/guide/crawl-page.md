# Crawl the page

Crawl a page via [crawlPage()](/api/crawl-page#crawlpage).

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  //Close browser
  browser.close()
})
```

## browser example

When you call the crawlPage API on the same crawler instance to crawl the page, the browser instance used is the same, because the browser instance shares the crawlPage API in the same crawler instance. For specific usage, please refer to [Browser](https://pptr.dev/api/puppeteer.browser).

::: warning
The browser will keep running, so the file will not be terminated. If you want to stop, you can execute browser.close() to close it. If you need to use [crawlPage](#Crawl-the-page) or [page](#page-example) later, please do not call it. Because the browser instance shares the crawlPage API in the same crawler instance.
:::

## page example

When you call the crawlPage API on the same crawler instance to crawl a page, a new page instance will be generated from the browser instance. For specific usage, please refer to [Page](https://pptr.dev/api/puppeteer.page).

::: warning
If you no longer use the page, you need to call page.close() to close the page instance yourself, otherwise it will cause a memory leak.
:::

## life cycle

The life cycle functions owned by crawlPage API:

- onCrawlItemComplete: will be called back when each crawling target is completed

### onCrawlItemComplete

In the onCrawlItemComplete function you can get the results of each crawled target in advance.

## Example

**Open browser**

Cancel running the browser in headless mode.

```js{6}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
   maxRetry: 3,
   //Cancel running the browser in headless mode
   crawlPage: { puppeteerLaunchOptions: { headless: false } }
})

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

**Get Screenshot**

```js{9}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then(async (res) => {
   const { browser, page } = res.data

   // Get a screenshot of the page after rendering
   await page.screenshot({ path: './upload/page.png' })

   console.log('Complete taking screenshot')

   browser.close()
})
```
