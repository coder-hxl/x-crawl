# 设备指纹

## 默认设备指纹

可以通过一个属性控制是否使用默认的随机指纹，您也可以通过后续的爬取配置自定义指纹。

设置设备指纹是为了避免通过指纹识别从不同位置识别并跟踪我们。

```js{3}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ enableRandomFingerprint: true })
```

enableRandomFingerprint 选项默认为 false 。

- true: 启动随机设备指纹。可通过进阶配置或详细目标配置指定目标的指纹配置。
- false: 关闭随机设备指纹，不影响进阶配置或详细目标配置为目标指定的指纹配置。

## 自定义设备指纹

自定义配置设备指纹，可避免通过指纹识别从不同位置识别并跟踪我们。

可以通过进阶用法在 fingerprints 传入多个信息，内部会帮助您随机分配给 targets 的每个目标。也可以直接用详细目标配置为目标设置特定的指纹。

以 crawlPage 为例：

```js{11,15,16,17,18,19,20,21,22,23,24,25,26,27,31,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 5000, min: 3000 } })

crawlApp.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    'https://www.example.com/page-2',
    'https://www.example.com/page-3',
    // 为此目标取消指纹
    { url: 'https://www.example.com/page-4', fingerprint: null },
    // 为此目标单独设置指纹
    {
      url: 'https://www.example.com/page-5',
      fingerprint: {
        mobile: 'random',
        platform: 'Windows',
        acceptLanguage: `zh-CN,zh;q=0.9,en;q=0.8`,
        userAgent: {
          value:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
          versions: [
            { name: 'Chrome', maxMinorVersion: 10, maxPatchVersion: 5615 },
            { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 }
          ]
        }
      }
    }
  ],
  // 为此次的目标统一设置指纹
  fingerprints: [
    // 设备指纹 1
    {
      maxWidth: 1024,
      maxHeight: 800,
      platform: 'Windows',
      mobile: 'random',
      userAgent: {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        versions: [
          {
            name: 'Chrome',
            // 浏览器版本
            maxMajorVersion: 112,
            minMajorVersion: 100,
            maxMinorVersion: 20,
            maxPatchVersion: 5000
          },
          {
            name: 'Safari',
            maxMajorVersion: 537,
            minMajorVersion: 500,
            maxMinorVersion: 36,
            maxPatchVersion: 5000
          }
        ]
      }
    },
    // 设备指纹 2
    {
      platform: 'Windows',
      mobile: 'random',
      userAgent: {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
        versions: [
          {
            name: 'Chrome',
            maxMajorVersion: 91,
            minMajorVersion: 88,
            maxMinorVersion: 10,
            maxPatchVersion: 5615
          },
          { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 },
          { name: 'Edg', maxMinorVersion: 10, maxPatchVersion: 864 }
        ]
      }
    },
    // 设备指纹 3
    {
      platform: 'Windows',
      mobile: 'random',
      userAgent: {
        value:
          'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        versions: [
          {
            name: 'Firefox',
            maxMajorVersion: 47,
            minMajorVersion: 43,
            maxMinorVersion: 10,
            maxPatchVersion: 5000
          }
        ]
      }
    }
  ]
})
```

更多指纹选项可以前往对应的配置查看。
