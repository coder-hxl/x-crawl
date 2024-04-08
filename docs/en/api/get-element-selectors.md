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

- View the [XCrawlOpenAIGetElementSelectorsContentOptions](#XCrawlOpenAIGetElementSelectorsContentOptions) type
- View the [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) type

**Return value type:**

- View the [XCrawlOpenAIGetElementSelectorsResult](#XCrawlOpenAIGetElementSelectorsResult) type

## Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp
  .getElementSelectors('HTML', 'Tell the AI what you want')
  .then((res) => {})
```
