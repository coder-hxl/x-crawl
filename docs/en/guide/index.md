# Introduction

## What is x-crawl?

x-crawl is a flexible Node.js AI-assisted crawler library. Flexible usage and powerful AI assistance functions make crawler work more efficient, intelligent and convenient.

It consists of two parts:

- Crawler: It consists of crawler API and various functions, which can work normally even without relying on AI.
- AI: Currently based on the large AI model provided by OpenAI, AI simplifies many tedious operations.

> If you find x-crawl helpful, or if you like x-crawl, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a like on GitHub A star. Your support is the driving force for our continuous improvement! thank you for your support!

## Features

- **🤖 AI Assistance** - Powerful AI assistance function makes crawler work more efficient, intelligent and convenient.
- **🖋️ Flexible writing** - A single crawling API is suitable for multiple configurations, and each configuration method has its own advantages.
- **⚙️Multiple uses** - Supports crawling dynamic pages, static pages, interface data and file data.
- **⚒️ Control page** - Crawling dynamic pages supports automated operations, keyboard input, event operations, etc.
- **👀 Device Fingerprinting** - Zero configuration or custom configuration to avoid fingerprint recognition to identify and track us from different locations.
- **🔥 Asynchronous Sync** - Asynchronous or synchronous crawling mode without switching crawling API.
- **⏱️ Interval crawling** - no interval, fixed interval and random interval, determine whether to crawl with high concurrency.
- **🔄 Failed Retry** - Customize the number of retries to avoid crawling failures due to temporary problems.
- **➡️ Rotation proxy** - Automatic proxy rotation with failed retries, custom error times and HTTP status codes.
- **🚀 Priority Queue** - Based on the priority of a single crawl target, it can be crawled ahead of other targets.
- **🧾 Crawl information** - Controllable crawl information, which will output colored string information in the terminal.
- **🦾 TypeScript** - Own types and implement complete types through generics.

## Example

```js
// 1. Import module ES/CJS
import { createCrawl } from 'x-crawl'

// 2. Create a crawler instance
const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

// 3. Set up crawling tasks
//Call the startPolling API to start the polling function, and the callback function will be called every other day
crawlApp.startPolling({ d: 1 }, async (count, stopPolling) => {
  // Call crawlPage API to crawl the page
  const pageResults = await crawlApp.crawlPage({
    targets: [
      'https://www.airbnb.cn/s/*/experiences',
      'https://www.airbnb.cn/s/plus_homes'
    ],
    viewport: { width: 1920, height: 1080 }
  })

  // Obtain the image URL by traversing the crawling page results
  const imgUrls = []
  for (const item of pageResults) {
    const { id } = item
    const { page } = item.data
    const elSelector = id === 1 ? '.i9cqrtb' : '.c4mnd7m'

    // Wait for page elements to appear
    await page.waitForSelector(elSelector)

    // Get the URL of the page image
    const urls = await page.$$eval(`${elSelector} picture img`, (imgEls) =>
      imgEls.map((item) => item.src)
    )
    imgUrls.push(...urls.slice(0, 6))

    // Close the page
    page.close()
  }

  //Call crawlFile API to crawl images
  await crawlApp.crawlFile({ targets: imgUrls, storeDirs: './upload' })
})
```

running result:

![](https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/run-example.gif)

::: warning
x-crawl is for legal use only. Any illegal activity using this tool is prohibited. Please be sure to comply with the robots.txt file regulations of the target website. The class name of the website may change at any time. This example is only used to demonstrate the use of x-crawl and is not specific to a specific website.
:::
