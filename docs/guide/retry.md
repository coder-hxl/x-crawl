# Retry on failure

It can avoid crawling failure due to temporary problems, and it will wait for the end of this round of crawling the target and crawl the target again.

It can be set in three places: Create crawler application instance, advanced usage, and detailed goals.

```js{6}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
   .crawlData({ url: 'https://www.example.com/api', maxRetry: 9 })
   .then((res) => {})
```

The maxRetry attribute determines how many times to retry.
