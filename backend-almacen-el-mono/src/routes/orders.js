import { Router } from 'express'
import { getProductById } from '../data/catalog.js'
import { createOrder, getOrderById } from '../store.js'

const router = Router()
const FREE_SHIPPING_FROM = 200000
const SHIPPING_FEE = 12000

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

router.post('/', (req, res) => {
  const { name, email, address, phone, items } = req.body ?? {}

  if (!name?.trim() || !isEmail(email) || !address?.trim() || !phone?.trim()) {
    res.status(400).json({ error: 'Nombre, correo, dirección y teléfono son obligatorios' })
    return
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'El pedido no tiene prendas' })
    return
  }

  const lines = []
  for (const item of items) {
    const product = getProductById(item.id)
    if (!product) {
      res.status(400).json({ error: `Producto no válido: ${item.id}` })
      return
    }

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) {
      res.status(400).json({ error: `Cantidad no válida para ${product.name}` })
      return
    }

    const size = String(item.size ?? '').trim()
    const color = String(item.color ?? '').trim()
    if (!product.sizes.includes(size) || !product.colors.includes(color)) {
      res.status(400).json({ error: `Talla o color no válido para ${product.name}` })
      return
    }

    lines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      quantity,
      subtotal: product.price * quantity,
    })
  }

  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  const order = {
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      phone: phone.trim(),
    },
    items: lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: 'confirmed',
  }

  createOrder(order)
  res.status(201).json({ order })
})

router.get('/:id', (req, res) => {
  const order = getOrderById(req.params.id)
  if (!order) {
    res.status(404).json({ error: 'Pedido no encontrado' })
    return
  }
  res.json({ order })
})

export default router
