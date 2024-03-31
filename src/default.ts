import { DetailTargetFingerprintCommon } from './types/api'

export const fingerprints: DetailTargetFingerprintCommon[] = [
  {
    platform: 'Windows',
    mobile: 'random',
    userAgent: {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      versions: [
        {
          name: 'Chrome',
          maxMajorVersion: 112,
          minMajorVersion: 100,
          maxMinorVersion: 10,
          maxPatchVersion: 5615
        },
        { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 }
      ]
    }
  },
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
