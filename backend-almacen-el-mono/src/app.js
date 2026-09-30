import cors from 'cors'
import express from 'express'
import path from 'node:path'
import contactRouter from './routes/contact.js'
import ordersRouter from './routes/orders.js'
import productsRouter, { categoriesRouter, storesRouter } from './routes/products.js'
import authRouter from './routes/auth.js'
import adsRouter from './routes/ads.js'
import brandsRouter from './routes/brands.js'
import mediaRouter from './routes/media.js'
import { optionalAuth, touchSession } from './auth.js'
import { sessionLimit } from './sessionLimit.js'

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

const corsOrigins = String(process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(optionalAuth)
app.use(touchSession)
app.use(sessionLimit)

app.get(['/', '/api'], (_req, res) => {
  res.json({
    ok: true,
    service: 'backend-almacen-el-mono',
    hint: 'Esta URL es la API. La tienda es el otro proyecto de Vercel (frontend).',
    health: '/api/health',
    products: '/api/products',
  })
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'backend-almacen-el-mono', dbPool: Number(process.env.MYSQL_POOL_LIMIT || 5) })
})

app.use('/api/auth', authRouter)
app.use('/api/ads', adsRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/media', mediaRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/stores', storesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/contact', contactRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

export default app
