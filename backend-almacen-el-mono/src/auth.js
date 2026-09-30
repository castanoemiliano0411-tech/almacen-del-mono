import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findUserById } from './db/queries.js'

const COOKIE = 'adm_token'
const DEFAULT_WORKER_PERMS = {
  content: false,
  products: false,
  brands: false,
  sizes: false,
  stock: false,
  ads: false,
  media: false,
}

export function workerPermissions(source = {}) {
  const content = source.content === false ? false : Boolean(source.content || source.products)
  return {
    content,
    products: content,
    brands: Boolean(source.brands),
    sizes: Boolean(source.sizes),
    stock: Boolean(source.stock),
    ads: Boolean(source.ads),
    media: source.media === false && !content ? false : Boolean(source.media || content),
  }
}

function secret() {
  return process.env.JWT_SECRET || 'el-almacen-del-mono-dev-secret'
}

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.role === 'admin'
      ? { content: true, products: true, brands: true, sizes: true, stock: true, ads: true, media: true, users: true }
      : user.role === 'worker'
        ? { ...DEFAULT_WORKER_PERMS, ...user.permissions, users: false }
        : { content: false, products: false, brands: false, sizes: false, stock: false, ads: false, media: false, users: false },
    status: user.status || 'active',
    createdAt: user.createdAt || null,
  }
}

export function can(user, permission) {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role !== 'worker') return false
  const perms = publicUser(user).permissions
  if (permission === 'products' || permission === 'content') {
    return Boolean(perms.content || perms.products || perms.ads)
  }
  if (permission === 'brands') {
    return Boolean(perms.brands || perms.ads)
  }
  if (permission === 'media') {
    return Boolean(perms.media || perms.content || perms.ads)
  }
  return Boolean(perms[permission])
}

const PENDING = 'adm_2fa'

function idleMs() {
  return Number(process.env.SESSION_IDLE_MS || 30 * 60 * 1000)
}

function cookie(name, value, maxAge) {
  const sameSite = process.env.COOKIE_SAMESITE || 'Lax'
  const secure =
    process.env.NODE_ENV === 'production' || sameSite.toLowerCase() === 'none' ? '; Secure' : ''
  return `${name}=${value}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure}`
}

export function setAuthCookie(res, user) {
  const maxAge = Math.floor(idleMs() / 1000)
  const token = jwt.sign({ id: user.id, role: user.role }, secret(), { expiresIn: maxAge })
  res.append('Set-Cookie', cookie(COOKIE, token, maxAge))
}

export function clearAuthCookie(res) {
  res.append('Set-Cookie', cookie(COOKIE, '', 0))
}

export function setPending2faCookie(res, user) {
  const token = jwt.sign({ id: user.id, pending2fa: true }, secret(), { expiresIn: '5m' })
  res.append('Set-Cookie', cookie(PENDING, token, 300))
}

export function clearPending2faCookie(res) {
  res.append('Set-Cookie', cookie(PENDING, '', 0))
}

export function readPending2fa(req) {
  const raw = req.headers.cookie || ''
  const match = raw.match(/(?:^|;\s*)adm_2fa=([^;]+)/)
  if (!match) return null
  try {
    const payload = jwt.verify(decodeURIComponent(match[1]), secret())
    return payload?.pending2fa ? payload : null
  } catch {
    return null
  }
}

export function readToken(req) {
  const cookieHeader = req.headers.cookie || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export async function optionalAuth(req, _res, next) {
  const token = readToken(req)
  if (!token) {
    req.user = null
    next()
    return
  }
  try {
    const payload = jwt.verify(token, secret())
    req.user = await findUserById(payload.id)
    if (req.user?.status === 'disabled') req.user = null
  } catch {
    req.user = null
  }
  next()
}

export function touchSession(req, res, next) {
  if (!req.user) {
    next()
    return
  }
  if (req.method === 'POST' && req.originalUrl.startsWith('/api/auth/')) {
    next()
    return
  }
  setAuthCookie(res, req.user)
  next()
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    res.status(401).json({ error: 'Tenés que iniciar sesión' })
    return
  }
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'No tenés permiso para esta función' })
      return
    }
    next()
  }
}

export const requireAdmin = requireRole('admin')

export function requirePerm(permission) {
  return (req, res, next) => {
    if (!can(req.user, permission)) {
      res.status(403).json({ error: 'El administrador no habilitó este permiso' })
      return
    }
    next()
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function checkPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export async function checkPasswordVariants(password, hash) {
  const source = String(password || '')
  const folded = source.normalize('NFD').replace(/\p{M}/gu, '')
  const withAccent = source.replace(/Almacen/gi, 'Almacén')
  for (const candidate of new Set([source, folded, withAccent])) {
    if (candidate && (await bcrypt.compare(candidate, hash))) return true
  }
  return false
}

export function newUserId() {
  return `usr-${randomUUID().slice(0, 8)}`
}

export { DEFAULT_WORKER_PERMS }
