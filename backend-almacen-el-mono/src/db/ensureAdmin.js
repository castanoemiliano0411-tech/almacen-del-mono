import { hashPassword } from '../auth.js'
import { query } from './pool.js'

export async function ensureStaffSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(120) NOT NULL,
      role ENUM('admin', 'worker', 'client') NOT NULL DEFAULT 'client',
      permissions JSON NOT NULL,
      status ENUM('active','disabled') NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL
    )
  `)
  await query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(40) PRIMARY KEY,
      user_id VARCHAR(40) NOT NULL,
      action VARCHAR(80) NOT NULL,
      detail JSON NOT NULL,
      created_at DATETIME NOT NULL
    )
  `)
  try {
    await query("ALTER TABLE users ADD COLUMN status ENUM('active','disabled') NOT NULL DEFAULT 'active'")
  } catch {
    // ya existe
  }
}

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Almacén del Mono Admin'
  if (!email || !password) return null

  await ensureStaffSchema()
  const passwordHash = await hashPassword(password)
  const permissions = JSON.stringify({})
  const existing = await query('SELECT id FROM users WHERE email = ? OR id = ? LIMIT 1', [email, 'usr-admin'])
  if (existing.length) {
    await query(
      `UPDATE users SET name = ?, email = ?, password_hash = ?, role = 'admin', permissions = ?, status = 'active' WHERE id = ?`,
      [name, email, passwordHash, permissions, existing[0].id],
    )
    return existing[0].id
  }
  await query(
    `INSERT INTO users (id, name, email, password_hash, role, permissions, status, created_at)
     VALUES (?, ?, ?, ?, 'admin', ?, 'active', NOW())`,
    ['usr-admin', name, email, passwordHash, permissions],
  )
  return 'usr-admin'
}
