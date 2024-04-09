# Device fingerprint

## Default device fingerprint

You can control whether to use the default random fingerprint through an attribute, or you can configure a custom fingerprint through subsequent crawling.

Setting up device fingerprints prevents us from being identified and tracked from different locations through fingerprint recognition.

```js{3}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ enableRandomFingerprint: true })
```

The enableRandomFingerprint option defaults to false .

- true: Enable random device fingerprinting. The fingerprint configuration of the target can be specified through advanced configuration or detailed target configuration.
- false: Turn off random device fingerprinting, which does not affect the fingerprint configuration specified for the target in the advanced configuration or detailed target configuration.

## Custom device fingerprint

Customizing device fingerprints prevents us from being identified and tracked from different locations through fingerprint recognition.

You can pass multiple pieces of information in fingerprints through advanced usage, and internally it will help you randomly assign each target to the targets. You can also directly use detailed target configuration to set specific fingerprints for the target.

Take crawlPage as an example:

```js{11,15,16,17,18,19,20,21,22,23,24,25,26,27,31,33,34,35,36,37,38,39,40 ,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,61,62,63,64,65,66 ,67,68,69,70,71,72,73,74,75,76,77,78,79,81,82,83,84,85,86,87,88,89,90,91,92 ,93,94,95,96,97}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 5000, min: 3000 } })

crawlApp.crawlPage({
   targets: [
     'https://www.example.com/page-1',
     'https://www.example.com/page-2',
     'https://www.example.com/page-3',
     //Cancel fingerprint for this target
     { url: 'https://www.example.com/page-4', fingerprint: null },
     //Set a separate fingerprint for this target
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
   // Set fingerprints uniformly for this target
   fingerprints: [
     //Device fingerprint 1
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
             // browser version
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
     //Device fingerprint 2
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
     //Device fingerprint 3
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

For more fingerprint options, you can go to the corresponding configuration to view.
