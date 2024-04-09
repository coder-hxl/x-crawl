# TypeScript

Type systems like TypeScript can detect many common errors at compile time through static analysis. This reduces runtime errors and gives us more confidence when refactoring large projects. TypeScript also improves the development experience and efficiency through type-based auto-completion in the IDE.

x-crawl itself is written in TypeScript and provides support for TypeScript. It comes with type declaration files and exports all types of corresponding versions of Puppeteer and OpenAI, which means you can directly import Puppeteer and OpenAI types from x-crawl without downloading additional type files of corresponding versions. It can be used out of the box.

```ts
// Get the Page and Browser types of Puppeteer
// Get the OpenAI and ClickOptions types of OpenAI
import type { Page, Browser, OpenAI, ClickOptions } from 'x-crawl'
```
