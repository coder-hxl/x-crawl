#createCrawl

Create a crawler application instance by calling createCrawl. The crawl target is maintained internally by the instance method, not by the instance.

## type

createCrawl API is a function.

```ts
function createCrawl(config?: CreateCrawlConfig): CrawlApp
```

**Parameter Type:**

- View the [CreateCrawlConfig](#CreateCrawlConfig) type

**Return value type:**

- View the [CrawlApp](#CrawlApp) type

## Example

```js
import { createCrawl } from 'x-crawl'

// createCrawl API
const crawlApp = createCrawl({
  baseUrl: 'https://www.example.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})
```
