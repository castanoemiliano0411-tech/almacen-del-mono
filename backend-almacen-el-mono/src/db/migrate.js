import 'dotenv/config'
import { hashPassword } from '../auth.js'
import { products, categories } from '../../../frontend-almacen-el-mono/src/data/products.js'
import { stores, WHATSAPP } from '../../../frontend-almacen-el-mono/src/data/stores.js'
import { pool, query } from './pool.js'

async function migrate() {
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(32) PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      brand VARCHAR(80) NOT NULL,
      category VARCHAR(40) NOT NULL,
      is_drop TINYINT(1) NOT NULL DEFAULT 0,
      price INT NOT NULL,
      compare_at INT NULL,
      promo VARCHAR(32) NULL,
      sizes JSON NOT NULL,
      colors JSON NOT NULL,
      featured TINYINT(1) NOT NULL DEFAULT 0,
      is_new TINYINT(1) NOT NULL DEFAULT 0,
      stock INT NOT NULL DEFAULT 0,
      rating DECIMAL(3,1) NOT NULL DEFAULT 0,
      reviews INT NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      details JSON NOT NULL,
      images JSON NOT NULL
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      image VARCHAR(500) NULL
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS stores (
      id VARCHAR(40) PRIMARY KEY,
      city VARCHAR(80) NOT NULL,
      name VARCHAR(80) NOT NULL,
      address VARCHAR(180) NOT NULL,
      hint TEXT NOT NULL,
      transit VARCHAR(180) NOT NULL,
      hours VARCHAR(80) NOT NULL,
      map_url VARCHAR(500) NOT NULL,
      whatsapp VARCHAR(32) NOT NULL
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(40) PRIMARY KEY,
      created_at DATETIME NOT NULL,
      customer JSON NOT NULL,
      items JSON NOT NULL,
      subtotal INT NOT NULL,
      shipping INT NOT NULL,
      total INT NOT NULL,
      status VARCHAR(32) NOT NULL
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id VARCHAR(40) PRIMARY KEY,
      created_at DATETIME NOT NULL,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) NOT NULL,
      message TEXT NOT NULL
    )
  `)

  try {
    await query('ALTER TABLE orders ADD COLUMN user_id VARCHAR(40) NULL')
  } catch {
    // la columna ya existe
  }

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(120) NOT NULL,
      role ENUM('admin', 'worker', 'client') NOT NULL DEFAULT 'client',
      permissions JSON NOT NULL,
      created_at DATETIME NOT NULL
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS ads (
      id VARCHAR(40) PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      image VARCHAR(500) NOT NULL,
      link_url VARCHAR(500) NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      created_by VARCHAR(40) NOT NULL,
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
    await query(
      "ALTER TABLE users ADD COLUMN status ENUM('active','disabled') NOT NULL DEFAULT 'active'",
    )
  } catch {
    // la columna ya existe
  }

  try {
    await query("ALTER TABLE ads ADD COLUMN schedule_mode VARCHAR(16) NOT NULL DEFAULT 'always'")
  } catch {
    // ya existe
  }
  try {
    await query('ALTER TABLE ads ADD COLUMN starts_at DATETIME NULL')
  } catch {
    // ya existe
  }
  try {
    await query('ALTER TABLE ads ADD COLUMN ends_at DATETIME NULL')
  } catch {
    // ya existe
  }

  await query(`
    CREATE TABLE IF NOT EXISTS media (
      id VARCHAR(40) PRIMARY KEY,
      url VARCHAR(500) NOT NULL,
      kind ENUM('image', 'video') NOT NULL,
      original_name VARCHAR(180) NOT NULL,
      created_by VARCHAR(40) NOT NULL,
      created_at DATETIME NOT NULL
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS brands (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(80) NOT NULL UNIQUE,
      slug VARCHAR(80) NOT NULL UNIQUE,
      image VARCHAR(500) NULL,
      sort_order INT NOT NULL DEFAULT 100,
      created_at DATETIME NOT NULL
    )
  `)

  const seedBrands = [
    { id: 'br-puma', name: 'Puma', slug: 'puma', image: '/brands/puma.png', sort: 1 },
    { id: 'br-nike', name: 'Nike', slug: 'nike', image: '/brands/nike.png', sort: 2 },
    { id: 'br-adidas', name: 'Adidas', slug: 'adidas', image: '/brands/adidas.webp', sort: 3 },
    { id: 'br-reebok', name: 'Reebok', slug: 'reebok', image: '/brands/reebok.png', sort: 4 },
    { id: 'br-ua', name: 'Under Armour', slug: 'under-armour', image: '/brands/under-armour.png', sort: 5 },
  ]
  for (const brand of seedBrands) {
    await query(
      `INSERT INTO brands (id, name, slug, image, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug), image = VALUES(image), sort_order = VALUES(sort_order)`,
      [brand.id, brand.name, brand.slug, brand.image, brand.sort],
    )
  }

  await query(`DELETE FROM brands WHERE name LIKE 'El Mono%'`)

  for (const category of categories) {
    await query(
      `INSERT INTO categories (id, name, image) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), image = VALUES(image)`,
      [category.id, category.name, category.image || null],
    )
  }

  for (const product of products) {
    await query(
      `INSERT INTO products (
        id, name, brand, category, is_drop, price, compare_at, promo,
        sizes, colors, featured, is_new, stock, rating, reviews,
        description, details, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        brand = VALUES(brand),
        category = VALUES(category),
        is_drop = VALUES(is_drop),
        price = VALUES(price),
        compare_at = VALUES(compare_at),
        promo = VALUES(promo),
        sizes = VALUES(sizes),
        colors = VALUES(colors),
        featured = VALUES(featured),
        is_new = VALUES(is_new),
        stock = VALUES(stock),
        rating = VALUES(rating),
        reviews = VALUES(reviews),
        description = VALUES(description),
        details = VALUES(details),
        images = VALUES(images)`,
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
        product.rating,
        product.reviews,
        product.description,
        JSON.stringify(product.details),
        JSON.stringify(product.images),
      ],
    )
  }

  for (const store of stores) {
    await query(
      `INSERT INTO stores (id, city, name, address, hint, transit, hours, map_url, whatsapp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         city = VALUES(city),
         name = VALUES(name),
         address = VALUES(address),
         hint = VALUES(hint),
         transit = VALUES(transit),
         hours = VALUES(hours),
         map_url = VALUES(map_url),
         whatsapp = VALUES(whatsapp)`,
      [
        store.id,
        store.city,
        store.name,
        store.address,
        store.hint,
        store.transit,
        store.hours,
        store.map,
        WHATSAPP.display,
      ],
    )
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    throw new Error('Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env (no van en el código).')
  }

  const demoUsers = [
    {
      id: 'usr-admin',
      name: process.env.ADMIN_NAME || 'Almacén del Mono Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      permissions: {},
    },
    {
      id: 'usr-staff',
      name: 'Trabajador',
      email: 'trabajador@elalmacendelmono.com',
      password: 'MonoStaff007!',
      role: 'worker',
      permissions: { content: true, products: true, brands: true, sizes: true, stock: true, ads: true, media: true },
    },
    {
      id: 'usr-stock',
      name: 'Inventario',
      email: 'stock@elalmacendelmono.com',
      password: 'MonoStock007!',
      role: 'worker',
      permissions: { products: false, sizes: false, stock: true, ads: false, media: false },
    },
    {
      id: 'usr-client',
      name: 'Cliente demo',
      email: 'cliente@elalmacendelmono.com',
      password: 'MonoCliente007!',
      role: 'client',
      permissions: {},
    },
  ]

  for (const user of demoUsers) {
    const passwordHash = await hashPassword(user.password)
    const permissions = JSON.stringify(user.permissions)
    let existing = await query('SELECT id FROM users WHERE id = ? LIMIT 1', [user.id])
    if (!existing.length) {
      existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [user.email])
    }
    if (existing.length) {
      await query(
        `UPDATE users SET name = ?, email = ?, password_hash = ?, role = ?, permissions = ? WHERE id = ?`,
        [user.name, user.email, passwordHash, user.role, permissions, existing[0].id],
      )
    } else {
      await query(
        `INSERT INTO users (id, name, email, password_hash, role, permissions, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [user.id, user.name, user.email, passwordHash, user.role, permissions],
      )
    }
  }

  const [{ products: productCount }] = await query('SELECT COUNT(*) AS products FROM products')
  const [{ stores: storeCount }] = await query('SELECT COUNT(*) AS stores FROM stores')
  const [{ users: userCount }] = await query('SELECT COUNT(*) AS users FROM users')
  console.log(`Migración lista: ${productCount} productos, ${storeCount} tiendas, ${userCount} usuarios. Pool máx. 5.`)
  await pool.end()
}

migrate().catch(async (error) => {
  console.error('No se pudo migrar:', error.message)
  await pool.end().catch(() => {})
  process.exit(1)
})
