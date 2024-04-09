# crawlFile

crawlFile is a method of a crawler instance, usually used to crawl files, such as images, pdf files, etc.

## type

crawlFile API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) that can be called with different configuration parameters (in terms of type).

```ts
type crawlFile = {
  (config: string): Promise<CrawlFileSingleResult>

  (config: CrawlFileDetailTargetConfig): Promise<CrawlFileSingleResult>

  (
    config: (string | CrawlFileDetailTargetConfig)[]
  ): Promise<CrawlFileSingleResult[]>

  (config: CrawlFileAdvancedConfig): Promise<CrawlFileSingleResult[]>
}
```

**Parameter Type:**

- View the [CrawlFileDetailTargetConfig](/type/crawl-file#crawlfiledetailtargetconfig) type
- View the [CrawlFileAdvancedConfig](/type/crawl-file#crawlfileadvancedconfig) type

**Return value type:**

- View the [CrawlFileSingleResult](/type/crawl-file#crawlfilesingleresult) type

## Example

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlFile API
crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDirs: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

## Configuration

There are 4 types in total:

- Simple target configuration - string
- Detailed target configuration - CrawlFileDetailTargetConfig
- Detailed target array configuration - (string | CrawlFileDetailTargetConfig)[]
- Advanced configuration - CrawlFileAdvancedConfig

### Simple target configuration - string

This is a simple target configuration. If you just want to simply crawl this file, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlFile('https://www.example.com/file').then((res) => {})
```

::: tip
The res obtained will be an object.
:::

### Detailed target configuration - CrawlFileDetailTargetConfig

This is the detailed target configuration. If you want to crawl this file and need to retry after failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlFile({
    url: 'https://www.example.com/file',
    proxy: { urls: ['xxx'] },
    maxRetry: 1,
    storeDir: './upload',
    fileName: 'xxx'
  })
  .then((res) => {})
```

For more configuration options, see [CrawlFileDetailTargetConfig](/type/crawl-file#crawlfiledetailtargetconfig).

::: tip
The res obtained will be an object.
:::

### Mixed target array configuration - (string | CrawlFileDetailTargetConfig)[]

This is a mixed target array configuration. If you want to crawl multiple files and some data needs to be failed and retried, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlFile([
    'https://www.example.com/file-1',
    { url: 'https://www.example.com/file-2', storeDir: './upload' },
    { url: 'https://www.example.com/file-3', storeDir: './upload', maxRetry: 2 }
  ])
  .then((res) => {})
```

For more configuration options, see [CrawlFileDetailTargetConfig](/type/crawl-file#crawlfiledetailtargetconfig).

::: tip
The res obtained will be an array containing objects.
:::

### Advanced configuration - CrawlFileAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. If you want to crawl multiple data, and you don’t want to write the crawling target configuration (proxy, storeDir, retry, etc.) repeatedly, and you also need interval time, device fingerprint, life cycle, etc., you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      { url: 'https://www.example.com/file-2', storeDir: './upload/file2' }
    ],
    storeDirs: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

For more configuration options, see [CrawlFileAdvancedConfig](/type/crawl-file/cn/type/crawl-file#crawlfileadvancedconfig).

::: tip
The res obtained will be an array containing objects.
:::

For more information about the results, please view [About the results](/guide/results#about-the-results). You can choose it according to the actual situation.
