# help

help 是 AI 应用实例的方法，通常用于智能回复爬虫问题。

## 类型

help API 是一个函数。

```ts
function help(
  content: string,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<string>
```

**参数类型：**

- 查看 [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) 类型

## 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp.help('告诉 AI 你的问题').then((res) => {})
```
