# Rotate proxy

In conjunction with failed retries, customized error times and HTTP status codes automatically rotate agents for crawling targets.

It can be set in three places: Create crawler application instance, advanced usage, and detailed goals.

Take crawlPage as an example:

```js
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

::: tip
This function needs to be retried upon failure to function properly.
:::
