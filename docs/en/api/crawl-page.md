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

- View the [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) type
- View the [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) type

**Return value type:**

- View the [CrawlPageSingleResult](#CrawlPageSingleResult) type

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

The res obtained will be an object.

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

The res obtained will be an object.

For more configuration options, see [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig).

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

The res obtained will be an array containing objects.

For more configuration options, see [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig).

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

The res obtained will be an array containing objects.

For more configuration options, see [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig).

For more information about the results, please view [About the results](#About the results). You can choose it according to the actual situation.
