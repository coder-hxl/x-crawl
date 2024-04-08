# TypeScript

像 TypeScript 这样的类型系统可以在编译时通过静态分析检测出很多常见错误。这减少了运行时错误，也让我们在重构大型项目的时候更有信心。通过 IDE 中基于类型的自动补全，TypeScript 还改善了开发体验和效率。

x-crawl 本身就是用 TypeScript 编写的，并对 TypeScript 提供了支持。自带类型声明文件，并且将对应版本 Puppeteer 和 OpenAI 的类型全部导出，意味着您可以直接从 x-crawl 导入 Puppeteer 和 OpenAI 的类型，无需额外下载对应版本的类型文件，开箱即用。
