import mysql from 'mysql2/promise'

const limit = Number(process.env.MYSQL_POOL_LIMIT || 5)

export const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  port: Number(process.env.MYSQL_ADDON_PORT || 3306),
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  waitForConnections: true,
  connectionLimit: limit,
  maxIdle: limit,
  queueLimit: 20,
  enableKeepAlive: true,
  ssl: { rejectUnauthorized: false },
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}
