# [v10.1.0](https://github.com/coder-hxl/x-crawl/compare/v10.0.2..v10.1.0) (2025-04-06)

### 🚀 Features

- Added ollama
- Change the openai model type to string

### ⛓️ Dependencies

- puppeteer from 22.13.1 to 24.6.0
- openai from 4.52.7 to 4.91.1
- upgrade non-major dependencies to the latest version

---

### 🚀 特征

- 新增 ollama
- openai 模型类型改为 string

### ⛓️ 依赖关系

- puppeteer 从 22.13.1 升至 24.6.0
- openai 从 4.52.7 升至 4.91.1
- 非主要依赖项升级最新版本

# [v10.0.2](https://github.com/coder-hxl/x-crawl/compare/v10.0.1..v10.0.2) (2024-07-21)

### 🚀 Features

- Added 'gpt-4o' | 'gpt-4o-2024-05-13' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' to OpenAIChatModel type to keep in sync with openai.

### ⛓️ Dependencies

- puppeteer from 22.5.0 to 22.13.1
- openai from 4.33.0 to 4.52.7
- https-proxy-agent from 7.0.4 to 7.0.5

---

### 🚀 特征

- OpenAIChatModel 类型新增 'gpt-4o' | 'gpt-4o-2024-05-13' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' ，与 openai 保持同步。

### ⛓️ 依赖关系

- puppeteer 从 22.5.0 升至 22.13.1
- openai 从 4.33.0 升至 4.52.7
- https-proxy-agent 从 7.0.4 升至 7.0.5

# [v10.0.1](https://github.com/coder-hxl/x-crawl/compare/v10.0.0..v10.0.1) (2024-04-10)

### 🐞 Bug fixes

- Fix the wrong export

---

### 🐞 漏洞修复

- 修复错误的导出

# [v10.0.0](https://github.com/coder-hxl/x-crawl/compare/v9.0.0..v10.0.0) (2024-04-10)

### 🚀 Features

- Introduction to the new AI-assisted features of x-crawl. In the latest version of x-crawl, we have introduced powerful AI-assisted features to make crawler work more efficient, intelligent and convenient. This innovative feature is mainly reflected in the following aspects:
  **1. Intelligent on-demand analysis elements**
  Traditional crawler work often requires manual analysis of the HTML page structure to extract the required element attributes or values. And now, with x-crawl’s AI assistance, you can easily implement intelligent on-demand analysis elements. Just tell AI which element information you want to obtain, and AI will automatically analyze the page structure and extract the corresponding element attributes or values.
  **2. Intelligent generation of element selectors**
  Selectors are an indispensable part of the crawler's work. They can help us quickly locate specific elements on the page. x-crawl's AI assistance can now intelligently generate element selectors for you. Just enter the HTML code into AI, and AI will automatically generate the appropriate selector for you based on the page structure, greatly simplifying the tedious process of determining the selector.
  **3. Intelligent reply to crawler questions**
  In crawler work, we will inevitably encounter various problems and challenges. And x-crawl’s AI assistance can provide you with intelligent answers and suggestions. Whether it is about crawling strategies, anti-crawling techniques or data processing, you can ask AI questions, and AI will provide you with professional answers and suggestions based on its powerful learning and reasoning capabilities to help you complete your tasks better. Reptile task.
  **4. User-defined AI functions**
  In order to meet the personalized needs of different users, x-crawl also provides user-customized AI functions. This means you can tailor and optimize the AI to your needs to better suit your crawling efforts. Whether you are adjusting the AI analysis strategy, optimizing the selector generation algorithm, or adding new functional modules, you can do it through simple operations to make AI more in line with your usage habits and workflow.
- The crawlFile API parameters are newly added string and (string | CrawlFileDetailTargetConfig)[], which is equivalent to the same four writing methods as crawlPage crawlHTML crawlData. The onBeforeSaveItemFile callback function configured by CrawlFileAdvancedConfig is no longer forced to return a Promise whose result is a Buffer, and can be Promise<Buffer | void> | Buffer | void.
- Refactor documents using VitePress, the new version of the document is at: https://coder-hxl.github.io/x-crawl .

### 🚨 Major changes

- CJS is no longer supported, only ESM is exported.
- xCrawl was renamed to createCrawl , and its crawlPage.puppeteerLaunch options were renamed to puppeteerLaunchOptions .
- The export method has been changed. The default export is no longer used, but the two functions createCrawl (original name xCrawl) and createCrawlOpenAI are directly exported.
- Remove startPolling API
- Cancel the second parameter (callback function) of these four APIs: crawlPage crawlHTML crawlData crawlFile
- type:
  - XCrawlConfig renamed to CreateCrawlConfig
  - XCrawlInstance renamed to CrawlApp

### ⛓️ Dependencies

- chalk upgraded from 4.1.2 to 5.3.0

---

### 🚀 特征

- x-crawl 全新 AI 辅助特性介绍，在 x-crawl 的最新版本中，我们引入了强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。这一创新特性主要体现在以下几个方面：
  **1. 智能按需分析元素**
  传统的爬虫工作往往需要手动分析 HTML 页面结构，提取所需的元素属性或值。而现在，借助 x-crawl 的 AI 辅助，您可以轻松实现智能按需分析元素。只需告诉AI您想获取哪些元素的信息，AI 便会自动分析页面结构，提取出相应的元素属性或值。
  **2. 智能生成元素选择器**
  选择器是爬虫工作中不可或缺的一部分，它能够帮助我们快速定位到页面中的特定元素。现在，x-crawl 的 AI 辅助可以为您智能生成元素选择器。只需将 HTML 代码输入到 AI 中，AI 便会根据页面结构自动为您生成合适的选择器，大大简化了确定选择器的繁琐过程。
  **3. 智能回复爬虫问题**
  在爬虫工作中，我们难免会遇到各种问题和挑战。而 x-crawl 的 AI 辅助可以为您提供智能的解答和建议。无论是关于爬虫策略、反爬虫技巧还是数据处理等方面的问题，您都可以向AI提问，AI会根据其强大的学习和推理能力，为您提供专业的解答和建议，帮助您更好地完成爬虫任务。
  **4. 用户自定义AI功能**
  为了满足不同用户的个性化需求，x-crawl 还提供了用户自定义 AI 的功能。这意味着您可以根据自己的需求，对 AI 进行定制和优化，使其更好地适应您的爬虫工作。无论是调整 AI 的分析策略、优化选择器的生成算法还是添加新的功能模块，您都可以通过简单的操作实现，让 AI 更加符合您的使用习惯和工作流程。
- crawlFile API 参数新增 string 和 (string | CrawlFileDetailTargetConfig)[] , 相当于跟 crawlPage crawlHTML crawlData 一样拥有四种写法。 CrawlFileAdvancedConfig 配置的 onBeforeSaveItemFile 回调函数不再强制返回一个结果是 Buffer 的 Promise , 可以是 Promise<Buffer | void> | Buffer | void 。
- 使用 VitePress 重构文档，新版文档在：https://coder-hxl.github.io/x-crawl/cn 。

### 🚨 重大改变

- 不再支持 CJS ，只导出 ESM 。
- xCrawl 更名为 createCrawl , 并且其 crawlPage.puppeteerLaunch 选项更名为 puppeteerLaunchOptions 。
- 导出方式改变, 不再使用默认导出, 而是改为直接导出 createCrawl(原名xCrawl) 和 createCrawlOpenAI 这两个函数。
- 删除 startPolling API
- 取消 crawlPage crawlHTML crawlData crawlFile 这四个 API 的第二参数 (回调函数)
- 类型:
  - XCrawlConfig 更名为 CreateCrawlConfig
  - XCrawlInstance 更名为 CrawlApp

### ⛓️ 依赖关系

- chalk 从 4.1.2 升至 5.3.0

# [v9.0.0](https://github.com/coder-hxl/x-crawl/compare/v8.3.1..v9.0.0) (2024-03-16)

### 🚨 Breaking Changes

- The enableRandomFingerprint attribute of XCrawlConfig configuration is changed to false by default
- Drop support for Node16

### ⛓️ Dependencies

- puppeteer upgraded from 21.6.1 to 22.5.0
- https-proxy-agent upgraded from 7.0.1 to 7.0.4

---

### 🚨 重大改变

- XCrawlConfig 配置的 enableRandomFingerprint 属性默认改为 false
- 放弃对 Node16 的支持

### ⛓️ 依赖关系

- puppeteer 从 21.6.1 升至 22.5.0
- https-proxy-agent 从 7.0.1 升至 7.0.4

# [v8.3.1](https://github.com/coder-hxl/x-crawl/compare/v8.3.0..v8.3.1) (2023-12-26)

### 🚀 Features

- The document adds a solution to the problem of program crash caused by using crawlPage API.
- puppeteer upgraded from 21.1.0 to 21.6.1.

---

### 🚀 特征

- 文档新增 使用 crawlPage API 造成程序崩溃 的解决方案。
- puppeteer 从 21.1.0 升至 21.6.1 。

# [v8.3.0](https://github.com/coder-hxl/x-crawl/compare/v8.2.0..v8.3.0) (2023-11-09)

### 🚀 Features

- Added log option to control printing information in the terminal.
- The terminal printing information has been upgraded to make it easier to distinguish the source of the information.

---

### 🚀 特征

- 新增 log 选项，用于控制在终端的打印信息。
- 终端打印信息升级，更容易区分信息来源。

# [v8.2.0](https://github.com/coder-hxl/x-crawl/compare/v8.1.1...v8.2.0) (2023-09-07)

### 🚀 Features

- Added crawlHTML API for crawling static HTML pages.

---

### 🚀 特征

- 新增 crawlHTML API ，用于爬取静态 HTML 页面。

# [v8.1.1](https://github.com/coder-hxl/x-crawl/compare/v8.1.0...v8.1.1) (2023-09-01)

### 🐞 Bug fixes

- default export type.

---

### 🐞 漏洞修复

- 默认导出的类型。

# [v8.1.0](https://github.com/coder-hxl/x-crawl/compare/v8.0.0...v8.1.0) (2023-09-01)

### 🚀 Features

- Limit Node.JS versions to 16.0.0 and above.
- Expose the corresponding puppeteer version type.
- Reduce package size and support ESM and cjs by packaging output a CJS file.

---

### 🚀 特征

- 对 Node.JS 版本进行限制，只有 16.0.0 版本以上才能使用。
- 将对应的 puppeteer 版本类型暴露出来。
- 减少包体积，通过打包输出一个 cjs 文件支持 ESM 和 CJS 。

# [v8.0.0](https://github.com/coder-hxl/x-crawl/compare/v7.1.3...v8.0.0) (2023-08-22)

### 🚨 Breaking Changes

- update dependencies

  - puppeteer from 19.10.0 to 21.1.0.
  - https-proxy-agent upgraded from 5.0.1 to 7.0.1.

- XCrawlConfig.crawlPage's launchBrowser option renamed to puppeteerLaunch .

---

### 🚨 重大改变

- 更新依赖

  - puppeteer 从 19.10.0 升至 21.1.0 。
  - https-proxy-agent 从 5.0.1 升至 7.0.1 。

- XCrawlConfig.crawlPage 的 launchBrowser 选项更名为 puppeteerLaunch 。

# [v7.1.3](https://github.com/coder-hxl/x-crawl/compare/v7.1.2...v7.1.3) (2023-07-02)

### 🐞 Bug fixes

- The crawlData API writes the correct data to the request body and processes the response body.

---

### 🐞 漏洞修复

- crawlData API 将正确的 data 写入请求体以及处理响应体。

# [v7.1.2](https://github.com/coder-hxl/x-crawl/compare/v7.1.1...v7.1.2) (2023-06-25)

### 🐞 Bug fixes

- Data parameter option conversion issue for crawlData API.

---

### 🐞 漏洞修复

- crawlData API 的 data 参数选项转换问题。

# [v7.1.1](https://github.com/coder-hxl/x-crawl/compare/v7.1.0...v7.1.1) (2023-06-21)

### 🐞 Bug fixes

- Correctly handle the header of the post method configured by the crawlData API.

---

### 🐞 漏洞修复

- 正确处理 crawlData API 配置 post 方法的 header 。

# [v7.1.0](https://github.com/coder-hxl/x-crawl/compare/v7.0.1...v7.1.0) (2023-05-15)

### 🚀 Features

- The flexibility of crawlFile API has been upgraded again, mainly adjusting fileName, storeDir, and extension.
  - The storeDir and extension of the advanced writing method (CrawlFileAdvancedConfig) are changed to storeDirs and extensions respectively, and the type is string or (string | null)[], and the fileNames option is added, and the type is (string | null)[] . If it is an array, it will be assigned to the crawling targets in order.
  - The fileName of the detailed target notation (CrawlFileDetailTargetConfig) adds a null type, which is used to use the default file name instead of the fileName corresponding to the advanced notation (CrawlFileAdvancedConfig) fileNames.

---

### 🚀 特征

- crawlFile API 灵活度再次升级，主要对 fileName、storeDir、extension 进行调整。
  - 进阶写法 (CrawlFileAdvancedConfig) 的 storeDir 和 extension 分别更改为 storeDirs 和 extensions ，类型为 string 或者 (string | null)[]，同时新增 fileNames 选项，类型为 (string | null)[] 。如果是数组则会按顺序分配给爬取目标。
  - 详细目标写法 (CrawlFileDetailTargetConfig) 的 fileName 新增 null 类型，用于使用默认文件名，不使用进阶写法 (CrawlFileAdvancedConfig) fileNames 对应的 fileName 。

# [v7.0.1](https://github.com/coder-hxl/x-crawl/compare/v7.0.0...v7.0.1) (2023-05-04)

### 🐞 Bug fixes

- The params configuration option for the crawlData API is not working.

---

### 🐞 漏洞修复

- crawlData API 的 params 配置选项不起作用。

# [v7.0.0](https://github.com/coder-hxl/x-crawl/compare/v6.0.1...v7.0.0) (2023-04-26)

### 🚨 Breaking Changes

- Fingerprint upgrade:
  - The fingerprint of the advanced writing method is renamed to fingerprints, which is an array writing method, which stores objects of the DetailTargetFingerprintCommon type, which is convenient for customization. Internally, the objects inside will be randomly assigned to the target.
  - Adjustment of crawlPage fingerprint options: the maximum width and height of the fingerprint configuration of advanced writing and detailed target writing are changed to optional.
- Proxy upgrade: create a crawler instance, change the proxy of the advanced writing method and the detailed target writing method to the object writing method, with three attributes: urls, switchByHttpStatus and switchByErrorCount, urls can set multiple proxy URLs, and the internal default uses the first one first, switchByHttpStatus Set which non-compliant response status codes need to switch the proxy, and switchByErrorCount sets how many times the proxy needs to be switched when errors such as timeouts arrive. The proxy rotation feature needs to be used with error retries.
- Return value type adjustment: CrawlCommonRes, CrawlPageSingleRes, CrawlDataSingleRes and CrawlFileSingleRes are renamed to CrawlCommonResult, CrawlPageSingleResult, CrawlDataSingleResult and CrawlFileSingleResult respectively

### 🚀 Features

- It is possible to cancel the configuration of the upper-level unified setting by setting null in the option.
- The userAgent option in DetailTargetFingerprintCommon overrides the object notation and allows customization of the maximum and minimum values of the major version, minor version, and revision number inside. Each crawl target gets a new userAgent .
- A new proxyDetails property is added to the crawling results to record the proxy status.
- Added 'random' attribute value to mobile option of fingerprint configuration, allowing internal randomization.
- Terminal prompts are simplified and color adjusted.

### 🐞 Bug fixes

- Unable to create multiple levels of non-existent folders on linux systems.

---

### 🚨 重大改变

- 指纹升级：
  - 进阶写法的 fingerprint 改名为 fingerprints ，为数组写法，里面存放 DetailTargetFingerprintCommon 类型的对象，方便定制。内部会将里面的对象随机分配给目标。
  - crawlPage 的指纹选项调整：进阶写法和详细目标写法的指纹配置的最大宽高改为可选项。
- 代理升级：创建爬虫实例、进阶写法以及详细目标写法的 proxy 更改为对象写法, 拥有 urls、switchByHttpStatus 以及 switchByErrorCount 这三个属性，urls 可以设置多个代理 URL ，内部默认先采用第一个，switchByHttpStatus 设置遇到哪些不符合的响应状态码需要切换代理，switchByErrorCount 设置像超时等错误时到达多少次需要切换代理。该代理轮换功能需要配合错误重试才能使用。
- 返回值类型调整：CrawlCommonRes、CrawlPageSingleRes、CrawlDataSingleRes 以及 CrawlFileSingleRes 分别更名为 CrawlCommonResult、CrawlPageSingleResult、CrawlDataSingleResult 以及 CrawlFileSingleResult

### 🚀 特征

- 可以通过在选项设置为 null 取消上级统一设置的配置。
- DetailTargetFingerprintCommon 里的 userAgent 选项改写对象写法，并允许定制里面的主版本、次版本以及修订号的最大值和最小值。每个爬取目标都会获取一个新的 userAgent 。
- 爬取结果新增 proxyDetails 属性，记录代理状态。
- 指纹配置的 mobile 选项添加 'random' 属性值，允许由内部随机决定。
- 终端提示信息进行简化以及颜色调整。

### 🐞 漏洞修复

- 在 linux 系统上无法创建多级不存在的文件夹。

# [v6.0.1](https://github.com/coder-hxl/x-crawl/compare/v6.0.0...v6.0.1) (2023-04-21)

### 🚀 Features

- Perfect documentation.

---

### 🚀 特征

- 完善文档。

# [v6.0.0](https://github.com/coder-hxl/x-crawl/compare/v5.1.0...v6.0.0) (2023-04-19)

### 🚨 Breaking Changes

- About the result processing of each crawling target: it will start processing after a single target is completed, saving time and improving performance. Originally, it waited for all targets to be completed before processing, and there would be free time during the crawling process.
- About the execution timing of the second parameter callback function of the crawlPage, crawlData, and crawlFile APIs: it will be executed at the end, and the result obtained is the same as the result of the Promise method.
- About the type: PageRequestConfig, DataRequestConfig and FileRequestConfig are changed to CrawlPageDetailTargetConfig, CrawlDataDetailTargetConfig and CrawlFileDetailTargetConfig respectively, the purpose is to not only add the configuration of the request, but also expand more, called detailed target usage. CrawlPageConfigObject, CrawlDataConfigObject, and CrawlFileConfigObject changed to CrawlPageAdvancedConfig, CrawlDataAdvancedConfig, and CrawlFileAdvancedConfig respectively, named Advanced Usage.
- Configuration options in fileConfig of crawlFile: can be set directly in the root object configuration. The beforeSave lifecycle function changed to onBeforeSaveItemFile.
- About the object results of crawlPage, crawlData and crawlFile: remove the crawlCount attribute, and get the number of times by retryCount + 1. errorQueue was renamed to crawlErrorQueue.

### 🚀 Features

- Added device fingerprint to avoid identifying and tracking us from different locations through fingerprint recognition. You can use the default with a switch, and if you need to specify it, you can set it uniformly for all crawling targets in the advanced usage, or you can specify the settings through the detailed target usage.
- Adding multiple attributes for each advanced usage can be configured in an advanced way to set the object uniformly, without having to set it repeatedly for each target configuration. The new onCrawlItemComplete lifecycle function will be executed after each crawling goal is completed, and the result of the crawling goal will be passed to the callback function.
- Added crawlPage in the configuration of creating a crawler application, you can set the configuration of creating a browser in the crawlPage.launchBrowser option (type is PuppeteerLaunchOptions from Puppeteer).
- crawlPage adds viewport option, which is used to set the viewport of the page.

---

### 🚨 重大改变

- 关于对每个爬取目标的结果处理：将会在单个目标完成后就开始进行处理，节省时间，提高性能。原先是等所有目标完成再处理，在爬过程中会有空闲时间。
- 关于 crawlPage、crawlData 以及 crawlFile 这三个 API 的第二个参数回调函数的执行时机：将移到最后执行，获取的结果跟 Promise 方式的结果相同。
- 关于类型：PageRequestConfig、DataRequestConfig 以及 FileRequestConfig 分别更改为 CrawlPageDetailTargetConfig、CrawlDataDetailTargetConfig 以及 CrawlFileDetailTargetConfig ，目的是为了不单单可以加请求的配置，也可以扩展更多，名为详细目标用法。CrawlPageConfigObject、 CrawlDataConfigObject 以及 CrawlFileConfigObject 分别更改为 CrawlPageAdvancedConfig、CrawlDataAdvancedConfig 以及 CrawlFileAdvancedConfig ，名为进阶用法。
- 关于 crawlFile 的 fileConfig 里面的配置选项：可以直接在根对象配置中设置。beforeSave 生命周期函数更改为 onBeforeSaveItemFile。
- 关于 crawlPage、crawlData 以及 crawlFile 的对象结果：移除 crawlCount 属性，可通过 retryCount + 1 获取次数。errorQueue 更名为 crawlErrorQueue。

### 🚀 特征

- 新增设备指纹，可避免通过指纹识别从不同位置识别并跟踪我们。可以通过一个开关使用默认的，如果需指定则可在进阶用法中为所有爬取目标统一设置，也可以通过详细目标用法指定设置。
- 每个进阶用法新增多个属性可以在进阶方式配置对象统一设置，不必为每个目标配置重复设置一遍。新增 onCrawlItemComplete 生命周期函数，将在每个爬取目标完成后执行，并且把爬取目标的结果传入回调函数。
- 在创建爬虫应用的配置新增 crawlPage ，可以在 crawlPage.launchBrowser 选项中设置创建浏览器的配置（类型为 PuppeteerLaunchOptions 来自 Puppeteer）。
- crawlPage 新增 viewport 选项，用于设置页面的视口。

# [v5.1.0](https://github.com/coder-hxl/x-crawl/compare/v5.0.2...v5.1.0) (2023-04-12)

### 🚨 Breaking Changes

- The beforeSave lifecycle function of crawlFile needs to return a Promise and resolve is a Buffer .

### 🚀 Features

- The description, characteristics and type of the document change.

### 🐞 Bug Fixes

- Incorrect type hints and type restrictions, using overloaded functions instead.

---

### 🚨 重大改变

- crawlFile 的 beforeSave 生命周期函数需要返回一个 Promise 并且 resolve 是 Buffer 。

### 🚀 特征

- 文档的描述、特征和类型发生变化。

### 🐞 漏洞修复

- 错误的类型提示和类型限制，改用重载函数。

# [v5.0.2](https://github.com/coder-hxl/x-crawl/compare/v5.0.1...v5.0.2) (2023-04-10)

### 🚀 Features

- When a retry is added, the number of retry batches is displayed in print.

---

### 🚀 特征

- 新增重试时，重试批次数将显示在打印中。

# [v5.0.1](https://github.com/coder-hxl/x-crawl/compare/v5.0.0...v5.0.1) (2023-04-08)

### 🚀 Features

- New adjustments to the document.

---

### 🚀 特征

- 文档新的调整。

# [v5.0.0](https://github.com/coder-hxl/x-crawl/compare/v4.0.1...v5.0.0) (2023-04-06)

### 🚨 Breaking Changes

- For configuration, major changes have been made to each crawling API configuration, and the same API supports more crawling configuration methods, each of which has its own significance.
- For the result, the result of each request will be wrapped in an object, which provides information about the result of this request, such as: id, result, success, maximum retry, number of retries, collected error information, etc. . Automatically determine whether the return value is wrapped in an array according to the configuration method you choose, and the type is perfectly matched in TS.
- For obtaining results through the callback function, the callback is no longer executed after a single request is completed like the v4.x version, but will be executed sequentially after the crawling is completed, which will not block subsequent crawling.

### 🚀 Features

- Added a retry mechanism, which can be set for all crawling requests, for a single crawling request, and for a single request.
- A new priority queue is added to use priority crawling according to the priority of a single request.
- For more configurations that may be reused, you can set the baseConfig settings passed in when requesting configuration, API crawling configuration, and generating crawler instances, such as: timeout, proxy, intervalTime, etc., and the weight is: requestConfig > APIConfig > baseConfig.
- For crawlFile API, file path, name, suffix and other information can be set individually for each file. Added the beforeSave life cycle function before saving the file. You can get the file data of the Buffer type, and you can perform operations such as compression on the data in the callback. The returned new Buffer data will replace the original data and write it into the file.
- Update the output of crawling on the console, and collect the error information generated by crawling into an error queue. After the crawling is completed, you can get the error message queue through the return value.

---

### 🚨 重大改变

- 对于配置，每个爬取 API 配置发生重大改变，同一个 API 支持更多爬取配置方式，每种方式都有其存在的意义。
- 对于结果，每个请求的结果将统一使用对象包裹着，该对象提供了关于这次请求结果的信息，比如：id、结果、是否成功、最大重试、重试次数、收集到错误信息等。自动根据你选用的配置方式决定返回值是否包裹在一个数组中，在 TS 中类型完美适配。
- 对于通过回调函数方式获取结果，该回调不再像 v4.x 版本在单个请求完成后执行，而是将会在爬取完成后按顺序执行，这将不会阻塞后续的爬取。

### 🚀 特征

- 新增失败重试，可针对所有爬取的请求设置，针对单次爬取的请求设置，针对单个请求设置进行失败重试。
- 新增优先队列，根据单个请求的优先级使用优先爬取。
- 对更多可能复用的配置可以在请求配置、API 爬取配置、生成爬虫实例时传入的 baseConfig 设置，比如：timeout、proxy、intervalTime 等，权重为：requestConfig > APIConfig > baseConfig。
- 对 crawlFile API 可单独为每个文件设置文件路径、名字、后缀等信息。新增 beforeSave 文件保存前生命周期函数，可拿到 Buffer 类型的文件数据，可在回调内对数据进行压缩等操作，返回新的 Buffer 数据会替代原先的数据写入文件中。
- 对爬取在控制台的输出更新，对爬取产生的报错信息分别收集到一个的错误队列中，爬取完成后可通过返回值拿到该错误信息队列。

# [v4.0.1](https://github.com/coder-hxl/x-crawl/compare/v4.0.0...v4.0.1) (2023-03-30)

### 🐞 Bug Fixes

- The page is not closed when there is an error in the crawlPage API

# [v4.0.0](https://github.com/coder-hxl/x-crawl/compare/v3.3.0...v4.0.0) (2023-03-27)

### 🚨 Breaking Changes

- The crawlPage API can add batch requests.
- The crawlPage API remove JSDOM.

### 🚀 Features

- Document updates.

# [v3.3.0](https://github.com/coder-hxl/x-crawl/compare/v3.2.12...v3.3.0) (2023-03-24)

### 🚀 Features

- The crawlerPage API crawling page allows to carry Cookies (for login and other operations).

# [v3.2.12](https://github.com/coder-hxl/x-crawl/compare/v3.2.11...v3.2.12) (2023-03-23)

### 🐞 Bug Fixes

- Document jump fix

# [v3.2.11](https://github.com/coder-hxl/x-crawl/compare/v3.2.10...v3.2.11) (2023-03-22)

### 🚀 Features

- Test updates, unit test all APIs

### 🐞 Bug Fixes

- Fix crawlPage API internal error

# [v3.2.10](https://github.com/coder-hxl/x-crawl/compare/v3.2.9...v3.2.10) (2023-03-21)

### 🚀 Features

- Update documents

# [v3.2.9](https://github.com/coder-hxl/x-crawl/compare/v3.2.8...v3.2.9) (2023-03-20)

### 🚀 Features

- Update dependency

# [v3.2.8](https://github.com/coder-hxl/x-crawl/compare/v3.2.7...v3.2.8) (2023-02-19)

### 🐞 Bug Fixes

- Internal type adjustment.
- Catch crawlPage API errors.

# [v3.2.7](https://github.com/coder-hxl/x-crawl/compare/v3.2.6...v3.2.7) (2023-03-14)

### 🚀 Features

- Update documents

# [v3.2.6](https://github.com/coder-hxl/x-crawl/compare/v3.2.5...v3.2.6) (2023-03-14)

### 🚀 Features

- Update documents

# [v3.2.5](https://github.com/coder-hxl/x-crawl/compare/v3.2.4...v3.2.5) (2023-03-12)

### 🚀 Features

- Update documents

# [v3.2.4](https://github.com/coder-hxl/x-crawl/compare/v3.2.3...v3.2.4) (2023-03-09)

### 🚀 Features

- Update documents

# [v3.2.3](https://github.com/coder-hxl/x-crawl/compare/v3.2.2...v3.2.3) (2023-03-08)

### 🚀 Features

- Update documents

# [v3.2.2](https://github.com/coder-hxl/x-crawl/compare/v3.2.1...v3.2.2) (2023-03-07)

### 🚀 Features

- Update documents

# [v3.2.1](https://github.com/coder-hxl/x-crawl/compare/v3.2.0...v3.2.1) (2023-03-07)

### 🚀 Features

- Update documents

# [v3.2.0](https://github.com/coder-hxl/x-crawl/compare/v3.1.1...v3.2.0) (2023-03-06)

### 🚀 Features

- crawlPage API return value update

### 🐞 Bug Fixes

- The result page of crawlPage API reported an error. Expose the browser and let the user decide to close the browser

# [v3.1.1](https://github.com/coder-hxl/x-crawl/compare/v3.1.0...v3.1.1) (2023-02-05)

### 🐞 Bug Fixes

- publish type is missing

# [v3.1.0](https://github.com/coder-hxl/x-crawl/compare/v3.0.0...v3.1.0) (2023-03-05)

### 🚀 Features

- The callback function adds a stopPolling parameter, which can be called to stop subsequent polling operations. The stop polling of the startPolling API is determined by the user

- Update documents

# [v3.0.0](https://github.com/coder-hxl/x-crawl/compare/v2.4.2...v3.0.0) (2023-03-04)

### 🚨 Breaking Changes

- The three APIs fetchPage, fetchData, and fetchFile are renamed to crawlPage, crawlData, and crawlFile respectively

### 🚀 Features

- Multiple ways of writing requestConfig options

- All types are exposed

# [v2.4.2](https://github.com/coder-hxl/x-crawl/compare/v2.4.1...v2.4.2) (2023-03-04)

### 🚀 Features

- Update documents

# [v2.4.1](https://github.com/coder-hxl/x-crawl/compare/v2.4.0...v2.4.1) (2023-03-04)

### 🐞 Bug Fixes

- Interval time doesn't work

# [v2.4.0](https://github.com/coder-hxl/x-crawl/compare/v2.3.0...v2.4.0) (2023-03-03)

### 🚀 Features

- Update documents

# [v2.3.0](https://github.com/coder-hxl/x-crawl/compare/v2.2.1...v2.3.0) (2023-03-02)

### 🚨 Breaking Changes

- fetchHTML API rename fetchPage

# [v2.2.1](https://github.com/coder-hxl/x-crawl/compare/v2.2.0...v2.2.1) (2023-03-01)

### 🚀 Features

- Update documents

# [v2.2.0](https://github.com/coder-hxl/x-crawl/compare/v2.1.0...v2.2.0) (2023-02-28)

### 🚀 Features

- Parameter config name correction
- Update documents

# [v2.1.0](https://github.com/coder-hxl/x-crawl/compare/v2.0.0...v2.1.0) (2023-02-28)

### 🚀 Features

- The fetchHTML API results remove content options
- The fetchHTML API cancels the incoming header attribute
- The running mode of crawling is highlighted

# [v2.0.0](https://github.com/coder-hxl/x-crawl/compare/v1.1.1...v2.0.0) (2023-02-27)

### 🚨 Breaking Changes

- Create a crawler method, created by calling
- The fetchHTML API uses puppeteer to crawl HTML
- The fetchPolling API renamed to startPolling, removed year and month

# [v1.1.1](https://github.com/coder-hxl/x-crawl/compare/v1.1.0...v1.1.1) (2023-02-22)

### 🚀 Features

- Add jump to a detailed type

# [v1.1.0](https://github.com/coder-hxl/x-crawl/compare/v1.0.1...v1.1.0) (2023-02-21)

### 🚀 Features

- The fetchFile API uses async for save file operations and sorts errors
- The fetchFile API fileConfig can pass in non-existing path

# [v1.0.1](https://github.com/coder-hxl/x-crawl/compare/v1.0.0...v1.0.1) (2023-02-20)

### 🚀 Features

- Sorting of error messages and fetchData/fetchFile API results

# [v1.0.0](https://github.com/coder-hxl/x-crawl/compare/v0.4.0...v1.0.0) (2023-02-17)

### 🚨 Breaking Changes

- Added the method of getting the request result through the callback function, The result of each request can be obtained through the callback function, and the total result can be obtained through PromIse
- API internal refactoring

# [v0.4.0](https://github.com/coder-hxl/x-crawl/compare/v0.3.1...v0.4.0) (2023-02-16)

### 🚀 Features

- The fetchFile API config can provide the extension of the downloaded file

# [v0.3.1](https://github.com/coder-hxl/x-crawl/compare/v0.3.0...v0.3.1) (2023-02-10)

### 🚀 Features

- Update documents

# [v0.3.0](https://github.com/coder-hxl/x-crawl/compare/v0.2.0...v0.3.0) (2023-02-10)

### 🚨 Breaking Changes

- Rename the data object raw of fetchHTML return value to html

### 🚀 Features

- Add proxy option

# [v0.2.0](https://github.com/coder-hxl/x-crawl/compare/v0.1.5...v0.2.0) (2023-02-09)

### 🚀 Features

- Add polling function

# [v0.1.5](https://github.com/coder-hxl/x-crawl/compare/v0.1.4...v0.1.5) (2023-02-05)

### 🐞 Bug Fixes

- Fix fetchFile API file save is lost

# [v0.1.4](https://github.com/coder-hxl/x-crawl/compare/v0.1.3...v0.1.4) (2023-02-05)

### 🚀 Features

- Add chalk library

# [v0.1.3](https://github.com/coder-hxl/x-crawl/compare/v0.1.2...v0.1.3) (2023-02-05)

### 🚀 Features

- fetchHTML API exposes more content

# [v0.1.2](https://github.com/coder-hxl/x-crawl/compare/v0.1.1...v0.1.2) (2023-02-02)

### 🚀 Features

- Add requst mode option: async/sync
- Document adjustment

# [v0.1.1](https://github.com/coder-hxl/x-crawl/compare/v0.1.0...v0.1.1) (2023-01-31)

### 🚀 Features

- fetchHTML API parameter can be Object type

# [v0.1.0](https://github.com/coder-hxl/x-crawl/compare/v0.0.3...v0.1.0) (2023-01-30)

### 🚀 Features

- fetch API renamed to fetchData API
- fetchData and fetchFile request handling

# [v0.0.3](https://github.com/coder-hxl/x-crawl/compare/v0.0.2...v0.0.3) (2023-01-29)

### 🚀 Features

- Request Protocol
- Use jest test

# [v0.0.2](https://github.com/coder-hxl/x-crawl/compare/v0.0.1...v0.0.2) (2023-01-28)

### 🐞 Bug Fixes

- Add jsdom type

- Combined configuration when the basic configuration is not undefined will be processed

# v0.0.1 (2023-01-28)

### 🚀 Features

- Feat：First release of x-crawl
