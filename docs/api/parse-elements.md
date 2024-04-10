# parseElements

parseElements is a method of AI application instances, typically used for intelligent on-demand analysis of elements.

## type

parseElements API is a function.

```ts
function parseElements<T extends Record<string, string>>(
  HTML: string,
  content: string | CrawlOpenAIParseElementsContentOptions,
  option?: CrawlOpenAICommonAPIOtherOption
): Promise<CrawlOpenAIParseElementsResult<T>>
```

**Parameter Type:**

- View the [CrawlOpenAIParseElementsContentOptions](/type/parse-elements#crawlopenaiparseelementscontentoptions) type
- View the [CrawlOpenAICommonAPIOtherOption](/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) type

**Return value type:**

- View the [CrawlOpenAIParseElementsResult](/type/parse-elements#crawlopenaiparseelementsresult) type

## Example

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

crawlOpenAIApp
  .parseElements('HTML', 'Tell the AI what you want')
  .then((res) => {})
```
