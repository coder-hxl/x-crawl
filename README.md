# x-crawl · [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![NPM Downloads](https://img.shields.io/npm/dt/x-crawl)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://coder-hxl.github.io/x-crawl) | [简体中文](https://coder-hxl.github.io/x-crawl/cn)

x-crawl is a flexible Node.js AI-assisted crawler library. Flexible usage and powerful AI assistance functions make crawler work more efficient, intelligent and convenient.

It consists of two parts:

- Crawler: It consists of a crawler API and various functions that can work normally even without relying on AI.
- AI: Currently based on the large AI model provided by OpenAI, AI simplifies many tedious operations.

> If you find x-crawl helpful, or you like x-crawl, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a like on GitHub A star. Your support is the driving force for our continuous improvement! thank you for your support!

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

## AI assisted crawler

With the rapid development of network technology, website updates have become more frequent, and changes in class names or structures often bring considerable challenges to crawlers that rely on these elements. Against this background, crawlers combined with AI technology have become a powerful weapon to meet this challenge.

First of all, changes in class names or structures after website updates may cause traditional crawler strategies to fail. This is because crawlers often rely on fixed class names or structures to locate and extract the required information. Once these elements change, the crawler may not be able to accurately find the required data, thus affecting the effectiveness and accuracy of data crawling.

However, crawlers combined with AI technology are better able to cope with this change. AI can also understand and parse the semantic information of web pages through natural language processing and other technologies to more accurately extract the required data.

To sum up, crawlers combined with AI technology can better cope with the problem of class name or structure changes after website updates.

## Example

The combination of crawler and AI allows the crawler and AI to obtain pictures of high-rated vacation rentals according to our instructions:

```js
import { createCrawl, createCrawlOpenAI } from 'x-crawl'

//Create a crawler application
const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

//Create AI application
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env['OPENAI_API_KEY'] },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})

// crawlPage is used to crawl pages
crawlApp.crawlPage('https://www.airbnb.cn/s/select_homes').then(async (res) => {
  const { page, browser } = res.data

  // Wait for the element to appear on the page and get the HTML
  const targetSelector = '[data-tracking-id="TOP_REVIEWED_LISTINGS"]'
  await page.waitForSelector(targetSelector)
  const highlyHTML = await page.$eval(targetSelector, (el) => el.innerHTML)

  // Let the AI get the image link and de-duplicate it (the more detailed the description, the better)
  const srcResult = await crawlOpenAIApp.parseElements(
    highlyHTML,
    `Get the image link, don't source it inside, and de-duplicate it`
  )

  browser.close()

  // crawlFile is used to crawl file resources
  crawlApp.crawlFile({
    targets: srcResult.elements.map((item) => item.src),
    storeDirs: './upload'
  })
})
```

**You can even send the whole HTML to the AI to help us operate, because the website content is more complex you also need to describe the location to get more accurately, and will consume a lot of Tokens.**

Procedure:

![](https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/example.gif)

Pictures of highly rated vacation rentals climbed to:

![](https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/example.png)

**Want to know more?**

For example: View the HTML that AI needs to process or view the srcResult (img url) returned by AI after parsing the HTML according to our instructions

All at the bottom of this example: https://coder-hxl.github.io/x-crawl/guide/#example

**warning**: x-crawl is for legal use only. Any illegal activity using this tool is prohibited. Please be sure to comply with the robots.txt file regulations of the target website. This example is only used to demonstrate the use of x-crawl and is not targeted at a specific website.

## Document

x-crawl latest version documentation:

[English](https://coder-hxl.github.io/x-crawl) | [简体中文](https://coder-hxl.github.io/x-crawl/cn)

x-crawl v9 documentation:

[English](https://github.com/coder-hxl/x-crawl/blob/v9.0.0/README.md) | [简体中文](https://github.com/coder-hxl/x-crawl/blob/v9.0.0/docs/cn.md)
