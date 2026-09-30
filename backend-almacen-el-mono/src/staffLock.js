import { randomUUID } from 'node:crypto'

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILS = 8
const fails = new Map()

function clientKey(req) {
  return req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
}

export function staffLoginGuard(req, res, next) {
  const key = clientKey(req)
  const rec = fails.get(key)
  if (rec && rec.count >= MAX_FAILS && Date.now() - rec.startedAt < WINDOW_MS) {
    res.status(429).json({ error: 'Demasiados intentos. Esperá unos minutos.' })
    return
  }
  next()
}

export function staffLoginFailed(req) {
  const key = clientKey(req)
  const now = Date.now()
  const rec = fails.get(key)
  if (!rec || now - rec.startedAt > WINDOW_MS) {
    fails.set(key, { startedAt: now, count: 1 })
    return
  }
  rec.count += 1
}

export function staffLoginOk(req) {
  fails.delete(clientKey(req))
}
