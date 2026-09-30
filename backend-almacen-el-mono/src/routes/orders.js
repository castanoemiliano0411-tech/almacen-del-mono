import { Router } from 'express'
import { requireAuth, requireAdmin } from '../auth.js'
import { createOrder, getOrderById, getProductById, listAllOrders, listOrdersByUser, updateProduct } from '../db/queries.js'

const router = Router()
const FREE_SHIPPING_FROM = 150000
const SHIPPING_FEE = 12000

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

router.get('/', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    res.json({ orders: await listAllOrders() })
  } catch (error) {
    next(error)
  }
})

router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    res.json({ orders: await listOrdersByUser(req.user.id) })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'client') {
      res.status(403).json({ error: 'Solo las cuentas de cliente pueden comprar' })
      return
    }
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
      const product = await getProductById(item.id)
      if (!product) {
        res.status(400).json({ error: `Producto no válido: ${item.id}` })
        return
      }

      const quantity = Number(item.quantity)
      if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400).json({ error: `Cantidad no válida para ${product.name}` })
        return
      }

      if (product.stock < quantity) {
        res.status(400).json({ error: `Sin stock suficiente de ${product.name}` })
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
        brand: product.brand,
        price: product.price,
        size,
        color,
        quantity,
        subtotal: product.price * quantity,
        stockLeft: product.stock - quantity,
      })
    }

    const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
    const order = {
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: req.user.id,
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        phone: phone.trim(),
      },
      items: lines.map(({ stockLeft, ...line }) => line),
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'confirmed',
    }

    await createOrder(order)
    for (const line of lines) {
      await updateProduct(line.id, { stock: line.stockLeft })
    }
    res.status(201).json({ order })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) {
      res.status(404).json({ error: 'Pedido no encontrado' })
      return
    }
    if (req.user.role !== 'admin' && order.userId !== req.user.id && order.customer?.email !== req.user.email) {
      res.status(403).json({ error: 'No podés ver este pedido' })
      return
    }
    res.json({ order })
  } catch (error) {
    next(error)
  }
})

export default router
