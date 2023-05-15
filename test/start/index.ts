import xCrawl from 'x-crawl'

const testXCrawl = xCrawl({
  baseUrl: 'http://8.210.98.225:9001/api/room/193581217/room_picture'
})

const names = [
  '1672468265289r193581217',
  '1672468265300r193581217',
  '1672468265284r193581217',
  '1672468265279r193581217',
  '1672468265298r193581217',
  '1672468265293r193581217'
]

const targets: string[] = []
const fileNames: (string | null)[] = []
const storeDirs: string[] = []
const extensions: (string | null)[] = []

names.forEach((name, i) => {
  targets.push(`/${name}.jpg`)

  if (i % 2) {
    fileNames.push(name)
    storeDirs.push(`./upload/${name}`)
    extensions.push('.jpg')
  } else {
    fileNames.push(null)
    storeDirs.push('./upload')
    extensions.push(null)
  }
})

testXCrawl.crawlFile({
  targets,
  storeDirs,
  fileNames,
  extensions
})
