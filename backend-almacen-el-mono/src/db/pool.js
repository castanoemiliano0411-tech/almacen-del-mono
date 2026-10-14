import mysql from 'mysql2/promise'

const limit = Number(process.env.MYSQL_POOL_LIMIT || 5)

const dbConfig = {
  host: process.env.MYSQL_ADDON_HOST,
  port: Number(process.env.MYSQL_ADDON_PORT || 3306),
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  waitForConnections: true,
  connectionLimit: limit,
  maxIdle: 1,
  idleTimeout: 10000,
  queueLimit: 20,
  enableKeepAlive: true,
  keepAliveInitialDelay: 5000,
  ssl: { rejectUnauthorized: false },
  connectTimeout: 12000,
}

export const pool = mysql.createPool(dbConfig)

function isDead(error) {
  return (
    error?.fatal === true ||
    error?.code === 'ECONNRESET' ||
    error?.code === 'ETIMEDOUT' ||
    error?.code === 'PROTOCOL_CONNECTION_LOST' ||
    error?.code === 'ECONNREFUSED'
  )
}

async function execute(sql, params) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function query(sql, params = []) {
  try {
    return await execute(sql, params)
  } catch (error) {
    if (!isDead(error)) throw error
    try {
      await pool.query('SELECT 1')
    } catch {
      // reconecta el pool
    }
    return execute(sql, params)
  }
}
