import http from 'node:http'

const html = `
  <body>
    <h1>Hi</h1>
    <script>document.body.appendChild(document.createElement("hr"))</script>
  </body>
`

http
  .createServer((req, res) => {
    const { url, method } = req
    console.log(method, url)

    let contentType = 'text/plain'
    let content: any = 'Please select /html or /data'

    if (url === '/html') {
      contentType = 'text/html; charset=utf-8'
      content = html
    } else if (url === '/data') {
      contentType = 'application/json'
      content = { code: 200, message: 'Hi' }
    }

    res.setHeader('Content-Type', contentType)
    res.end(typeof content === 'string' ? content : JSON.stringify(content))
  })
  .listen(8888, () => {
    console.log(`服务器在 8888 端口启动成功~`)
  })
