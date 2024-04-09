# help

help is a method of AI application instance, usually used to intelligently reply to crawler questions.

## type

help API is a function.

```ts
function help(
  content: string,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<string>
```

**Parameter Type:**

- View the [XCrawlOpenAICommonAPIOtherOption](/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) type

## Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp.help('Tell the AI your problem').then((res) => {})
```
