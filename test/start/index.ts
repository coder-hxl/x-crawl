import path from 'node:path'
import xCrawl from '../../src'

const testXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})
