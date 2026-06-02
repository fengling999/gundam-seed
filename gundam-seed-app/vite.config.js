import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 资源（图片/音频）仍然放在仓库根目录的 ../assets，不复制、不搬动。
// 这个小插件在开发时把 /assets/* 直接从 ../assets 读出来，
// 在 build 时把 ../assets 拷进 dist/assets。跨平台（Win/Mac/Linux）都可用。
const ASSETS_ROOT = path.resolve(__dirname, '..', 'assets')

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json',
}

function sharedAssets() {
  return {
    name: 'shared-parent-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/assets/')) return next()
        const rel = decodeURIComponent(req.url.split('?')[0].slice('/assets/'.length))
        const fp = path.join(ASSETS_ROOT, rel)
        if (!fp.startsWith(ASSETS_ROOT)) return next() // 防目录穿越
        if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
          res.setHeader('Content-Type', MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream')
          fs.createReadStream(fp).pipe(res)
        } else {
          next()
        }
      })
    },
    closeBundle() {
      const out = path.resolve(__dirname, 'dist', 'assets')
      if (fs.existsSync(ASSETS_ROOT)) {
        fs.cpSync(ASSETS_ROOT, out, { recursive: true })
      }
    },
  }
}

export default defineConfig({
  root: __dirname,
  plugins: [sharedAssets()],
})
