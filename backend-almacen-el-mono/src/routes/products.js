import { Router } from 'express'
import { categories, filterProducts, getProductById } from '../data/catalog.js'

const router = Router()

router.get('/', (req, res) => {
  const { category, q, featured } = req.query
  res.json({ products: filterProducts({ category, q, featured }) })
})

router.get('/:id', (req, res) => {
  const product = getProductById(req.params.id)
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }
  res.json({ product })
})

export const categoriesRouter = Router()

categoriesRouter.get('/', (_req, res) => {
  res.json({ categories })
})

export default router
