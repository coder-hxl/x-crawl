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

- 查看 [XCrawlOpenAIGetElementSelectorsContentOptions](/cn/type/get-element-selectors#crawlopenaigetelementselectorscontentoptions) 类型
- 查看 [XCrawlOpenAICommonAPIOtherOption](/cn/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIGetElementSelectorsResult](/cn/type/get-element-selectors#crawlopenaigetelementselectorsresult) 类型

## 示例

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

crawlOpenAIApp.getElementSelectors('HTML', '告诉 AI 你想要的').then((res) => {})
```
