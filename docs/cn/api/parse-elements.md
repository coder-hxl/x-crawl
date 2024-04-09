# parseElements

parseElements 是 AI 应用实例的方法，通常用于智能按需分析元素。

## 类型

parseElements API 是一个函数。

```ts
function parseElements<T extends Record<string, string>>(
  HTML: string,
  content: string | XCrawlOpenAIParseElementsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIParseElementsResult<T>>
```

**参数类型：**

- 查看 [XCrawlOpenAIParseElementsContentOptions](#XCrawlOpenAIParseElementsContentOptions) 类型
- 查看 [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIParseElementsResult](#XCrawlOpenAIParseElementsResult) 类型

## 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp.parseElements('HTML', '告诉 AI 你想要的').then((res) => {})
```
