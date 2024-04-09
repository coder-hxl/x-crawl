# createXCrawlOpenAI

Create an AI application instance by calling createXCrawlOpenAI.

## type

createXCrawlOpenAI API is a function.

```ts
function createXCrawlOpenAI(config?: CreateXCrawlOpenAIConfig): XCrawlOpenAIApp
```

**Parameter Type:**

- View the [CreateXCrawlOpenAIConfig](#CreateXCrawlOpenAIConfig) type

**Return value type:**

- View the [XCrawlOpenAIApp](#XCrawlOpenAIApp) type

## Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

// xCrawlOpenAIApp API
const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```
