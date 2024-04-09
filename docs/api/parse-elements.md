#parseElements

parseElements is a method of AI application instances, typically used for intelligent on-demand analysis of elements.

## type

parseElements API is a function.

```ts
function parseElements<T extends Record<string, string>>(
  HTML: string,
  content: string | XCrawlOpenAIParseElementsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIParseElementsResult<T>>
```

**Parameter Type:**

- View the [XCrawlOpenAIParseElementsContentOptions](#XCrawlOpenAIParseElementsContentOptions) type
- View the [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) type

**Return value type:**

- View the [XCrawlOpenAIParseElementsResult](#XCrawlOpenAIParseElementsResult) type

## Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp
  .parseElements('HTML', 'Tell the AI what you want')
  .then((res) => {})
```
