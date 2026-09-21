import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import contactRouter from './routes/contact.js'
import ordersRouter from './routes/orders.js'
import productsRouter, { categoriesRouter } from './routes/products.js'

const app = express()
const port = Number(process.env.PORT) || 4000
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: corsOrigin }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'backend-almacen-el-mono' })
})

app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/contact', contactRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(port, () => {
  console.log(`API Almacén del Mono en http://localhost:${port}`)
})
