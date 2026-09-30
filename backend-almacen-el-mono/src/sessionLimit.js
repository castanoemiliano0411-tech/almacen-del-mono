import { randomUUID } from 'node:crypto'

const MAX = Number(process.env.SESSION_MAX_REQUESTS || 5)
const WINDOW_MS = Number(process.env.SESSION_WINDOW_MS || 30 * 60 * 1000)
const hits = new Map()

function readSid(req) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/(?:^|;\s*)adm_sid=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

function isPublicCatalog(req) {
  if (req.method !== 'GET') return false
  const path = req.path
  return (
    path === '/' ||
    path === '/api' ||
    path === '/api/health' ||
    path.startsWith('/api/products') ||
    path.startsWith('/api/categories') ||
    path.startsWith('/api/stores') ||
    path.startsWith('/api/brands') ||
    path === '/api/ads/public' ||
    path.startsWith('/uploads')
  )
}

export function sessionLimit(req, res, next) {
  if (req.path.startsWith('/api/auth') || isPublicCatalog(req)) {
    next()
    return
  }

  if (req.user) {
    next()
    return
  }

  let sid = readSid(req)
  if (!sid) {
    sid = randomUUID()
    res.append('Set-Cookie', `adm_sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`)
  }

  const now = Date.now()
  const current = hits.get(sid)
  if (!current || now - current.startedAt > WINDOW_MS) {
    hits.set(sid, { startedAt: now, count: 1 })
    next()
    return
  }

  if (current.count >= MAX) {
    res.status(429).json({
      error: `Esta sesión llegó al máximo de ${MAX} peticiones. Esperá un rato e intentá de nuevo.`,
    })
    return
  }

  current.count += 1
  next()
}
