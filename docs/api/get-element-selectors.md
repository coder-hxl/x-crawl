# getElementSelectors

getElementSelectors is a method of AI application instance, usually used to intelligently generate element selectors.

## type

parseElements API is a function.

```ts
function getElementSelectors(
  HTML: string,
  content: string | XCrawlOpenAIGetElementSelectorsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIGetElementSelectorsResult>
```

**Parameter Type:**

- View the [XCrawlOpenAIGetElementSelectorsContentOptions](/type/get-element-selectors#crawlopenaigetelementselectorscontentoptions) type
- View the [XCrawlOpenAICommonAPIOtherOption](/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) type

**Return value type:**

- View the [XCrawlOpenAIGetElementSelectorsResult](/type/get-element-selectors#crawlopenaigetelementselectorsresult) type

## Example

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

crawlOpenAIApp
  .getElementSelectors('HTML', 'Tell the AI what you want')
  .then((res) => {})
```
