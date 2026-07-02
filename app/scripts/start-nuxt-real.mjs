process.env.ITAKAI_USE_REAL_BACKEND_OVERRIDE = 'true'
process.env.NUXT_PUBLIC_USE_REAL_BACKEND = 'true'
// Force the browser to call /api/... (relative). Nitro proxies it to the local
// dev API on :3002 (NODE_ENV=development, itakai_dev DB). Without this override
// .env's NUXT_PUBLIC_API_BASE (pointing to prod) would leak into dev.
process.env.NUXT_PUBLIC_API_BASE = '/api'
process.env.ITAKAI_API_PROXY_TARGET = process.env.ITAKAI_API_PROXY_TARGET || 'http://localhost:3002'
process.env.ITAKAI_DEV_PORT = process.argv.includes('--port')
  ? process.argv[process.argv.indexOf('--port') + 1]
  : process.env.ITAKAI_DEV_PORT || '4000'

await import('../node_modules/nuxt/bin/nuxt.mjs')
