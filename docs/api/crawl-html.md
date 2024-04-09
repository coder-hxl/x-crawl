# crawlHTML

crawlHTML is a method of crawler instance, usually used to crawl static HTML pages.

## type

crawlHTML API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) that can be called with different configuration parameters (in terms of type).

```ts
type crawlHTML = {
  (config: string): Promise<CrawlHTMLSingleResult>

  (config: CrawlHTMLDetailTargetConfig): Promise<CrawlHTMLSingleResult>

  (
    config: (string | CrawlHTMLDetailTargetConfig)[]
  ): Promise<CrawlHTMLSingleResult[]>

  (config: CrawlHTMLAdvancedConfig): Promise<CrawlHTMLSingleResult[]>
}
```

**Parameter Type:**

- View the [CrawlHTMLDetailTargetConfig](/type/crawl-html#crawlhtmldetailtargetconfig) type
- View the [CrawlHTMLAdvancedConfig](/type/crawl-html#crawlhtmladvancedconfig) type

**Return value type:**

- View the [CrawlHTMLSingleResult](/type/crawl-html#crawlhtmlsingleresult) type

## Example

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlHTML API
crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

## Configuration

There are 4 types in total:

- Simple target configuration - string
- Detailed target configuration - CrawlHTMLDetailTargetConfig
- Mixed target array configuration - (string | CrawlHTMLDetailTargetConfig)[]
- Advanced configuration - CrawlHTMLAdvancedConfig

### Simple target configuration - string

This is a simple target configuration. If you just want to simply crawl this static HTML page, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

::: tip
The res obtained will be an object.
:::

### Detailed target configuration - CrawlHTMLDetailTargetConfig

This is the detailed target configuration. If you want to crawl this static HTML page and need to retry after failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlHTML({
    url: 'https://www.example.com',
    proxy: { urls: ['xxx'] },
    maxRetry: 1
  })
  .then((res) => {})
```

For more configuration options, see [CrawlHTMLDetailTargetConfig](/type/crawl-html#crawlhtmldetailtargetconfig).

::: tip
The res obtained will be an object.
:::

### Mixed target array configuration - (string | CrawlHTMLDetailTargetConfig)[]

This is a mixed target array configuration. If you want to crawl multiple static HTML pages, and some static HTML pages need to be retried after failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlHTML([
    'https://www.example.com/page-1',
    { url: 'https://www.example.com/page-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

For more configuration options, see [CrawlHTMLDetailTargetConfig](/type/crawl-html#crawlhtmldetailtargetconfig).

::: tip
The res obtained will be an array containing objects.
:::

### Advanced configuration - CrawlHTMLAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. If you want to crawl multiple static HTML pages, and you don’t want to write the crawling target configuration (proxy, cookies, retry, etc.) repeatedly, and you also need interval time, device fingerprint, life cycle, etc., you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlHTML({
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

For more configuration options, see [CrawlHTMLAdvancedConfig](/type/crawl-html#crawlhtmladvancedconfig).

::: tip
The res obtained will be an array containing objects.
:::

For more information about the results, please view [About the results](/guide/results#about-the-results). You can choose it according to the actual situation.
