import 'dotenv/config'
import { hashPassword } from '../auth.js'
import { pool, query } from './pool.js'

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Almacén del Mono Admin'
  if (!email || !password) {
    console.error('Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env. No las pongas en el código.')
    process.exit(1)
  }

  const passwordHash = await hashPassword(password)
  const permissions = JSON.stringify({})

  const existing = await query('SELECT id FROM users WHERE email = ? OR id = ? LIMIT 1', [email, 'usr-admin'])
  if (existing.length) {
    await query(
      `UPDATE users SET name = ?, email = ?, password_hash = ?, role = 'admin', permissions = ?, status = 'active' WHERE id = ?`,
      [name, email, passwordHash, permissions, existing[0].id],
    )
  } else {
    await query(
      `INSERT INTO users (id, name, email, password_hash, role, permissions, status, created_at)
       VALUES (?, ?, ?, ?, 'admin', ?, 'active', NOW())`,
      ['usr-admin', name, email, passwordHash, permissions],
    )
  }

  console.log(`Administrador inicial listo: ${email} · rol admin (hash bcrypt)`)
  await pool.end()
}

seedAdmin().catch(async (error) => {
  console.error('No se pudo crear el administrador. Corré antes: npm run migrate')
  console.error(error.message)
  await pool.end().catch(() => {})
  process.exit(1)
})
