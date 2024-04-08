# getElementSelectors

getElementSelectors 是 AI 应用实例的方法，通常用于智能生成元素选择器。

## 类型

parseElements API 是一个函数。

```ts
function getElementSelectors(
  HTML: string,
  content: string | XCrawlOpenAIGetElementSelectorsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIGetElementSelectorsResult>
```

**参数类型：**

- 查看 [XCrawlOpenAIGetElementSelectorsContentOptions](#XCrawlOpenAIGetElementSelectorsContentOptions) 类型
- 查看 [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIGetElementSelectorsResult](#XCrawlOpenAIGetElementSelectorsResult) 类型

## 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp
  .getElementSelectors('HTML', '告诉 AI 你想要的')
  .then((res) => {})
```
