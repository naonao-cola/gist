import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, 'public')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url)
  // strip /gist/ prefix for local dev (baseUrl: naonao-cola.github.io/gist)
  url = url.replace(/^\/gist/, '') || '/'
  if (url === '/') url = '/index.html'

  let filePath = path.join(publicDir, url)

  // clean URL: try adding .html
  if (!fs.existsSync(filePath) && !path.extname(url)) {
    const withHtml = filePath + '.html'
    if (fs.existsSync(withHtml)) filePath = withHtml
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(fs.readFileSync(filePath))
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('404 Not Found')
  }
}).listen(8080)

console.log('🌐 本地预览: http://localhost:8080/')
