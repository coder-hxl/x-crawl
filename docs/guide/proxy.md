# Rotate proxy

In conjunction with failed retries, customized error times and HTTP status codes automatically rotate agents for crawling targets.

```js{8,9,10,11,12,13,14,15,16}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
   .crawlPage({
     url: 'https://www.example.com',
     maxRetry: 10,
     proxy: {
       urls: [
         'https://www.example.com/proxy-1',
         'https://www.example.com/proxy-2'
       ],
       switchByHttpStatus: [401, 403],
       switchByErrorCount: 3
     }
   })
   .then((res) => {})
```

In the above example, we use `switchByErrorCount` to set 3 opportunities for each agent. When the 3 opportunities are used up, the next agent will be automatically switched. If `switchByHttpStatus` is provided, the proxy will be automatically switched based on the status code first.

::: tip
This parameter is available only when maxRetry fails. maxRetry must be greater than the sum of switchByErrorCount of all proxies in the target, because maxRetry controls the number of retries of the target.
:::

**It can be set in three places: Create crawler application instance, advanced usage, and detailed goals. **

Take crawlPage as an example:

```js{13,17,18,19,20,21,22,23,26,28,29,30,31,32,33,34,35,36}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
   .crawlPage({
     targets: [
       'https://www.example.com/page-1',
       'https://www.example.com/page-2',
       'https://www.example.com/page-3',
       'https://www.example.com/page-4',
       // Cancel the proxy for this target
       { url: 'https://www.example.com/page-6', proxy: null },
       // Set up a separate proxy for this target
       {
         url: 'https://www.example.com/page-6',
         proxy: {
           urls: [
             'https://www.example.com/proxy-4',
             'https://www.example.com/proxy-5'
           ],
           switchByErrorCount: 3
         }
       }
     ],
     maxRetry: 10,
     // Set the proxy uniformly for this target
     proxy: {
       urls: [
         'https://www.example.com/proxy-1',
         'https://www.example.com/proxy-2',
         'https://www.example.com/proxy-3'
       ],
       switchByErrorCount: 3,
       switchByHttpStatus: [401, 403]
     }
   })
   .then((res) => {})
```
