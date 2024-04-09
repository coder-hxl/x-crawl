# 关于结果

每个爬取目标都会产生一个详情对象，该详情对象会包含以下属性：

- id：根据爬取目标的顺序生成的，如果有优先级，则会根据优先级生成
- isSuccess：是否成功爬取
- maxRetry：该次爬取目标的最大重试次数
- retryCount：该次爬取目标已经重试的次数
- proxyDetails：记录代理情况
- crawlErrorQueue：该次爬取目标的报错收集
- data：该次爬取目标的爬取数据

如果是特定的配置，会自动根据你选用的配置方式决定详情对象是否存放在一个数组中，并把该数组返回，否则返回详情对象。已经在 TypeScript 中类型完美适配。

相关的配置方式和结果详情查看：

- [crawlPage 配置](/cn/api/crawl-page#配置)
- [crawlHTML 配置](/cn/api/crawl-html#配置)
- [crawlData 配置](/cn/api/crawl-data#配置)
- [crawlFile 配置](/cn/api/crawl-file#配置)
