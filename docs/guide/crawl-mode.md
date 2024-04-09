# Crawling mode

A crawler application instance has two crawling modes: asynchronous/synchronous, and each crawler instance can only choose one of them.

```js{3}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ mode: 'async' })
```

The mode option defaults to async .

- async: asynchronous crawling target, no need to wait for the current crawling target to be completed before proceeding to the next crawling target
- sync: synchronous crawling target. You need to wait for the completion of this crawling target before proceeding to the next crawling target.

If there is an interval set, you need to wait for the interval to end before crawling the next target.

::: tip
The crawling process of the crawling API is performed independently, which means that if two crawlPages are called, they will not interfere with each other. This mode is only effective for batch crawling targets.
:::
