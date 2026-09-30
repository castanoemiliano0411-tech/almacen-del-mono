import { query } from './pool.js'

function parseJson(value, fallback) {
  if (value == null) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    drop: Boolean(row.is_drop),
    price: Number(row.price),
    compareAt: row.compare_at == null ? null : Number(row.compare_at),
    promo: row.promo,
    sizes: parseJson(row.sizes, []),
    colors: parseJson(row.colors, []),
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    stock: Number(row.stock),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    description: row.description,
    details: parseJson(row.details, []),
    images: parseJson(row.images, []),
  }
}

export async function listProducts({ category, q, featured } = {}) {
  const rows = await query(
    `SELECT * FROM products
     ORDER BY featured DESC, is_new DESC, name ASC`,
  )
  let list = rows.map(mapProduct)

  if (category && category !== 'todo') {
    if (category === 'novedades' || category === 'drops') {
      list = list.filter((item) => item.drop || item.isNew)
    } else if (category === 'sale') {
      list = list.filter((item) => item.promo)
    } else {
      list = list.filter((item) => item.category === category)
    }
  }

  if (featured === 'true' || featured === true) {
    list = list.filter((item) => item.featured)
  }

  const term = typeof q === 'string' ? q.trim().toLowerCase() : ''
  if (term) {
    list = list.filter((item) => {
      const haystack = [item.name, item.brand, item.category, item.description].join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }

  return list
}

export async function getProductById(id) {
  const rows = await query('SELECT * FROM products WHERE id = ? LIMIT 1', [id])
  return rows[0] ? mapProduct(rows[0]) : null
}

export async function listCategories() {
  const rows = await query('SELECT id, name, image FROM categories ORDER BY name')
  return rows
}

export async function listStores() {
  const rows = await query('SELECT * FROM stores ORDER BY city')
  return rows
}

export async function createOrder(order) {
  await query(
    `INSERT INTO orders (id, created_at, customer, items, subtotal, shipping, total, status, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id,
      order.createdAt.slice(0, 19).replace('T', ' '),
      JSON.stringify(order.customer),
      JSON.stringify(order.items),
      order.subtotal,
      order.shipping,
      order.total,
      order.status,
      order.userId || null,
    ],
  )
  return order
}

export async function listOrdersByUser(userId) {
  const rows = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId])
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    customer: parseJson(row.customer, {}),
    items: parseJson(row.items, []),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
  }))
}

export async function getOrderById(id) {
  const rows = await query('SELECT * FROM orders WHERE id = ? LIMIT 1', [id])
  if (!rows[0]) return null
  const row = rows[0]
  return {
    id: row.id,
    createdAt: row.created_at,
    customer: parseJson(row.customer, {}),
    items: parseJson(row.items, []),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    userId: row.user_id,
  }
}

export async function createMessage(message) {
  await query(
    `INSERT INTO contact_messages (id, created_at, name, email, message)
     VALUES (?, ?, ?, ?, ?)`,
    [
      message.id,
      message.createdAt.slice(0, 19).replace('T', ' '),
      message.name,
      message.email,
      message.message,
    ],
  )
  return message
}

export function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    permissions: parseJson(row.permissions, {}),
    status: row.status || 'active',
    createdAt: row.created_at,
  }
}

function foldIdent(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '')
}

export async function findUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
  return mapUser(rows[0])
}

export async function findStaffByIdentifier(identifier) {
  const raw = String(identifier || '').trim()
  if (!raw) return null

  const lower = raw.toLowerCase()
  const compact = foldIdent(raw)
  for (const email of new Set([lower, compact])) {
    if (!email.includes('@')) continue
    const found = await findUserByEmail(email)
    if (found) return found
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminName = process.env.ADMIN_NAME || 'Almacén del Mono Admin'
  if (adminEmail) {
    const aliases = [
      foldIdent(adminEmail),
      foldIdent(adminName),
      foldIdent(`${adminName}@gmail.com`),
      'almacendelmonoadmin@gmail.com',
      'almacendelmono.admin@gmail.com',
    ]
    if (aliases.includes(compact) || compact === foldIdent(adminName)) {
      return findUserByEmail(adminEmail)
    }
  }

  return null
}

export async function findUserById(id) {
  const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
  return mapUser(rows[0])
}

export async function listUsers({ q, role, status } = {}) {
  const rows = await query('SELECT * FROM users ORDER BY created_at DESC, name')
  let list = rows.map(mapUser)
  const term = String(q || '').trim().toLowerCase()
  if (term) {
    const parts = term.split(/\s+/).filter(Boolean)
    list = list.filter((user) => {
      const hay = foldIdent([user.id, user.name, user.email, user.role, user.status].join(' '))
      return parts.every((part) => hay.includes(foldIdent(part)))
    })
  }
  if (role) list = list.filter((user) => user.role === role)
  if (status) list = list.filter((user) => user.status === status)
  return list
}

export async function insertUser(user) {
  await query(
    `INSERT INTO users (id, name, email, password_hash, role, permissions, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [
      user.id,
      user.name,
      user.email,
      user.passwordHash,
      user.role,
      JSON.stringify(user.permissions || {}),
    ],
  )
  return findUserById(user.id)
}

export async function updateUserRole(id, role, permissions) {
  await query('UPDATE users SET role = ?, permissions = ? WHERE id = ?', [
    role,
    JSON.stringify(permissions || {}),
    id,
  ])
  return findUserById(id)
}

export async function updateUserAccount(id, { name, passwordHash }) {
  if (name) {
    await query('UPDATE users SET name = ? WHERE id = ?', [name, id])
  }
  if (passwordHash) {
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id])
  }
  return findUserById(id)
}

export async function insertProduct(product) {
  await query(
    `INSERT INTO products (
      id, name, brand, category, is_drop, price, compare_at, promo,
      sizes, colors, featured, is_new, stock, rating, reviews,
      description, details, images
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.id,
      product.name,
      product.brand,
      product.category,
      product.drop ? 1 : 0,
      product.price,
      product.compareAt,
      product.promo,
      JSON.stringify(product.sizes),
      JSON.stringify(product.colors),
      product.featured ? 1 : 0,
      product.isNew ? 1 : 0,
      product.stock ?? 0,
      product.rating ?? 0,
      product.reviews ?? 0,
      product.description,
      JSON.stringify(product.details || []),
      JSON.stringify(product.images),
    ],
  )
  return getProductById(product.id)
}

export async function updateProduct(id, patch) {
  const current = await getProductById(id)
  if (!current) return null
  const next = { ...current, ...patch }
  await query(
    `UPDATE products SET
      name = ?, brand = ?, category = ?, is_drop = ?, price = ?, compare_at = ?, promo = ?,
      sizes = ?, colors = ?, featured = ?, is_new = ?, stock = ?, description = ?, details = ?, images = ?
     WHERE id = ?`,
    [
      next.name,
      next.brand,
      next.category,
      next.drop ? 1 : 0,
      next.price,
      next.compareAt,
      next.promo,
      JSON.stringify(next.sizes),
      JSON.stringify(next.colors),
      next.featured ? 1 : 0,
      next.isNew ? 1 : 0,
      next.stock ?? 0,
      next.description,
      JSON.stringify(next.details || []),
      JSON.stringify(next.images),
      id,
    ],
  )
  return getProductById(id)
}

function toSqlDateTime(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function mapAd(row, { publicOnly = false } = {}) {
  const ad = {
    id: row.id,
    title: row.title,
    image: row.image,
    link: row.link_url,
    active: Boolean(row.active),
    scheduleMode: row.schedule_mode || 'always',
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdBy: row.created_by,
  }
  if (publicOnly) {
    return { id: ad.id, title: ad.title, image: ad.image, link: ad.link }
  }
  return { ...ad, live: adIsLive(ad) }
}

export function adIsLive(ad, now = Date.now()) {
  if (!ad.active) return false
  const mode = ad.scheduleMode || 'always'
  const start = ad.startsAt ? new Date(ad.startsAt).getTime() : null
  const end = ad.endsAt ? new Date(ad.endsAt).getTime() : null
  if (start != null && Number.isNaN(start)) return false
  if (end != null && Number.isNaN(end)) return false
  if (mode === 'always') return true
  if (mode === 'until') return end == null || now <= end
  if (start != null && now < start) return false
  if (end != null && now > end) return false
  return true
}

export async function listAds() {
  const rows = await query('SELECT * FROM ads ORDER BY created_at DESC')
  return rows.map((row) => mapAd(row))
}

export async function listActiveAds() {
  const rows = await query('SELECT * FROM ads WHERE active = 1 ORDER BY created_at DESC')
  return rows
    .map((row) => mapAd(row))
    .filter((ad) => ad.live)
    .map((ad) => ({
      id: ad.id,
      title: ad.title,
      image: ad.image,
      link: ad.link,
    }))
}

export async function insertAd(ad) {
  await query(
    `INSERT INTO ads (id, title, image, link_url, active, created_by, created_at, schedule_mode, starts_at, ends_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
    [
      ad.id,
      ad.title,
      ad.image,
      ad.link,
      ad.active ? 1 : 0,
      ad.createdBy,
      ad.scheduleMode || 'always',
      toSqlDateTime(ad.startsAt),
      toSqlDateTime(ad.endsAt),
    ],
  )
  const rows = await query('SELECT * FROM ads WHERE id = ?', [ad.id])
  return mapAd(rows[0])
}

export async function setAdActive(id, active) {
  await query('UPDATE ads SET active = ? WHERE id = ?', [active ? 1 : 0, id])
}

export async function deleteAd(id) {
  await query('DELETE FROM ads WHERE id = ?', [id])
}

export async function updateUserStatus(id, status) {
  await query('UPDATE users SET status = ? WHERE id = ?', [status, id])
  return findUserById(id)
}

export async function deleteProduct(id) {
  await query('DELETE FROM products WHERE id = ?', [id])
}

export async function listAllOrders() {
  const rows = await query('SELECT * FROM orders ORDER BY created_at DESC')
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    userId: row.user_id,
    customer: parseJson(row.customer, {}),
    items: parseJson(row.items, []),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
  }))
}

export async function insertAudit(entry) {
  await query(
    `INSERT INTO audit_logs (id, user_id, action, detail, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [entry.id, entry.userId, entry.action, JSON.stringify(entry.detail || {})],
  )
}

export async function listAuditLogs() {
  const rows = await query(
    `SELECT a.id, a.user_id, a.action, a.detail, a.created_at,
            u.name AS actor_name, u.email AS actor_email, u.role AS actor_role
     FROM audit_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC
     LIMIT 200`,
  )
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    actorName: row.actor_name || 'Cuenta borrada',
    actorEmail: row.actor_email || '',
    actorRole: row.actor_role || '',
    action: row.action,
    detail: parseJson(row.detail, {}),
    createdAt: row.created_at,
  }))
}

export async function upsertCategory(category) {
  await query(
    `INSERT INTO categories (id, name, image) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), image = VALUES(image)`,
    [category.id, category.name, category.image || null],
  )
}

export async function insertMedia(entry) {
  await query(
    `INSERT INTO media (id, url, kind, original_name, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [entry.id, entry.url, entry.kind, entry.originalName, entry.createdBy],
  )
  return findMediaById(entry.id)
}

export async function findMediaById(id) {
  const rows = await query('SELECT * FROM media WHERE id = ? LIMIT 1', [id])
  return rows[0]
    ? {
        id: rows[0].id,
        url: rows[0].url,
        kind: rows[0].kind,
        originalName: rows[0].original_name,
        createdBy: rows[0].created_by,
        createdAt: rows[0].created_at,
      }
    : null
}

export async function listMedia() {
  const rows = await query('SELECT * FROM media ORDER BY created_at DESC')
  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    kind: row.kind,
    originalName: row.original_name,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }))
}

export async function deleteMedia(id) {
  await query('DELETE FROM media WHERE id = ?', [id])
}

export function slugBrand(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function mapBrand(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image || '',
    sortOrder: Number(row.sort_order),
  }
}

export async function listBrands() {
  const rows = await query('SELECT * FROM brands ORDER BY sort_order, name')
  return rows.map(mapBrand)
}

export async function findBrandByName(name) {
  const rows = await query('SELECT * FROM brands WHERE name = ? LIMIT 1', [name])
  return mapBrand(rows[0])
}

export async function upsertBrand(brand) {
  await query(
    `INSERT INTO brands (id, name, slug, image, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug), image = VALUES(image), sort_order = VALUES(sort_order)`,
    [brand.id, brand.name, brand.slug, brand.image || null, brand.sortOrder ?? 100],
  )
  const rows = await query('SELECT * FROM brands WHERE id = ? LIMIT 1', [brand.id])
  return mapBrand(rows[0])
}

export async function updateBrand(id, patch) {
  const current = await query('SELECT * FROM brands WHERE id = ? LIMIT 1', [id])
  if (!current[0]) return null
  const next = { ...mapBrand(current[0]), ...patch }
  await query('UPDATE brands SET name = ?, slug = ?, image = ?, sort_order = ? WHERE id = ?', [
    next.name,
    next.slug,
    next.image || null,
    next.sortOrder ?? 100,
    id,
  ])
  const rows = await query('SELECT * FROM brands WHERE id = ? LIMIT 1', [id])
  return mapBrand(rows[0])
}

export async function deleteBrand(id) {
  await query('DELETE FROM brands WHERE id = ?', [id])
}
