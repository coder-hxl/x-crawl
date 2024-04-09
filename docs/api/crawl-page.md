# crawlPage

crawlPage is a method of crawler instance, usually used to crawl dynamic pages.

## type

crawlPage API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) that can be called with different configuration parameters (in terms of type).

```ts
type crawlPage = {
  (config: string): Promise<CrawlPageSingleResult>

  (config: CrawlPageDetailTargetConfig): Promise<CrawlPageSingleResult>

  (
    config: (string | CrawlPageDetailTargetConfig)[]
  ): Promise<CrawlPageSingleResult[]>

  (config: CrawlPageAdvancedConfig): Promise<CrawlPageSingleResult[]>
}
```

**Parameter Type:**

- View the [CrawlPageDetailTargetConfig](/type/crawl-page#crawlpagedetailtargetconfig) type
- View the [CrawlPageAdvancedConfig](/type/crawl-page#crawlpageadvancedconfig) type

**Return value type:**

- View the [CrawlPageSingleResult](/type/crawl-page#crawlpagesingleresult) type

## Example

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlPage API
crawlApp.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  //Close browser
  browser.close()
})
```

## Configuration

There are 4 types in total:

- Simple target configuration - string
- Detailed target configuration - CrawlPageDetailTargetConfig
- Mixed target array configuration - (string | CrawlPageDetailTargetConfig)[]
- Advanced configuration - CrawlPageAdvancedConfig

### Simple target configuration - string

This is a simple target configuration. If you just want to simply crawl this page, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

::: tip
The res obtained will be an object.
:::

### Detailed target configuration - CrawlPageDetailTargetConfig

This is the detailed target configuration. If you want to crawl this page and need to retry after failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlPage({
    url: 'https://www.example.com',
    proxy: { urls: ['xxx'] },
    maxRetry: 1
  })
  .then((res) => {})
```

For more configuration options, see [CrawlPageDetailTargetConfig](/type/crawl-page#crawlpagedetailtargetconfig).

::: tip
The res obtained will be an object.
:::

### Mixed target array configuration - (string | CrawlPageDetailTargetConfig)[]

This is a mixed target array configuration. If you want to crawl multiple pages, and some pages need to be failed and retried, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlPage([
    'https://www.example.com/page-1',
    { url: 'https://www.example.com/page-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

For more configuration options, see [CrawlPageDetailTargetConfig](/type/crawl-page#crawlpagedetailtargetconfig).

::: tip
The res obtained will be an array containing objects.
:::

### Advanced configuration - CrawlPageAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. If you want to crawl multiple pages, and you don’t want to write the crawling target configuration (proxy, cookies, retry, etc.) repeatedly, and you also need interval, device fingerprint, life cycle, etc., you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      { url: 'https://www.example.com/page-2', maxRetry: 6 }
    ],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

For more configuration options, see [CrawlPageAdvancedConfig](/type/crawl-page#crawlpageadvancedconfig).

::: tip
The res obtained will be an array containing objects.
:::

For more information about the results, please view [About the results](/guide/results#about-the-results). You can choose it according to the actual situation.
