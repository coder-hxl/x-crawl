# createXCrawlOpenAI

Create an AI application instance by calling createXCrawlOpenAI.

## type

createXCrawlOpenAI API is a function.

```ts
function createXCrawlOpenAI(config?: CreateXCrawlOpenAIConfig): XCrawlOpenAIApp
```

**Parameter Type:**

- View the [CreateXCrawlOpenAIConfig](/type/create-crawl-openai#createcrawlopenaiconfig) type

**Return value type:**

- View the [XCrawlOpenAIApp](/type/create-crawl-openai#crawlopenaiapp) type

## Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

// xCrawlOpenAIApp API
const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```
