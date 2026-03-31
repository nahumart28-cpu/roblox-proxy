const http = require('http')
const https = require('https')

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const match1 = req.url.match(/^\/bundle\/(\d+)$/)
  const match2 = req.url.match(/^\/bundleprice\/(\d+)$/)

  let targetUrl = ''

  if (match1) {
    targetUrl = `https://catalog.roblox.com/v1/assets/${match1[1]}/bundles`
  } else if (match2) {
    targetUrl = `https://catalog.roblox.com/v1/bundles/${match2[1]}/details`
  } else {
    res.writeHead(200)
    res.end('Proxy activo')
    return
  }

  https.get(targetUrl, (proxyRes) => {
    let data = ''
    proxyRes.on('data', chunk => data += chunk)
    proxyRes.on('end', () => {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(data)
    })
  }).on('error', () => {
    res.writeHead(500)
    res.end('{}')
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log('Proxy corriendo')
})
