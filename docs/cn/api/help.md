# help

help 是 AI 应用实例的方法，通常用于智能回复爬虫问题。

## 类型 {#type}

help API 是一个函数。

```ts
function help(
  content: string,
  option?: CrawlOpenAICommonAPIOtherOption
): Promise<string>
```

**参数类型：**

- 查看 [CrawlOpenAICommonAPIOtherOption](/cn/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) 类型

## 示例 {#example}

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

crawlOpenAIApp.help('告诉 AI 你的问题').then((res) => {})
```
