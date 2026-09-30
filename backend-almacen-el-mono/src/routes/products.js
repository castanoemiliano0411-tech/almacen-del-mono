import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { can, requireAuth, requireAdmin, requirePerm } from '../auth.js'
import { logAction } from '../audit.js'
import {
  deleteProduct,
  getProductById,
  insertProduct,
  listCategories,
  listProducts,
  listStores,
  updateProduct,
  upsertCategory,
} from '../db/queries.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { category, q, featured } = req.query
    res.json({ products: await listProducts({ category, q, featured }) })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, requirePerm('products'), async (req, res, next) => {
  try {
    const body = req.body ?? {}
    if (!body.name?.trim() || !body.brand?.trim() || !body.category || !body.price) {
      res.status(400).json({ error: 'Nombre, marca, categoría y precio son obligatorios' })
      return
    }
    const sizes = Array.isArray(body.sizes)
      ? body.sizes
      : String(body.sizes || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
    const colors = Array.isArray(body.colors)
      ? body.colors
      : String(body.colors || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
    const images = Array.isArray(body.images)
      ? body.images
      : String(body.images || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)

    const product = await insertProduct({
      id: `am-${randomUUID().slice(0, 6)}`,
      name: body.name.trim(),
      brand: body.brand.trim(),
      category: body.category,
      drop: Boolean(body.drop),
      price: Number(body.price),
      compareAt: body.compareAt ? Number(body.compareAt) : null,
      promo: body.promo || null,
      sizes: sizes.length ? sizes : ['M'],
      colors: colors.length ? colors : ['Negro'],
      featured: Boolean(body.featured),
      isNew: true,
      stock: Number(body.stock || 0),
      rating: 0,
      reviews: 0,
      description: body.description?.trim() || 'Nueva pieza de El Almacén del Mono.',
      details: body.details || ['El Almacén del Mono'],
      images: images.length
        ? images
        : ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80'],
    })
    await logAction(req, 'product_create', { id: product.id })
    res.status(201).json({ product })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id)
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }
    res.json({ product })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const current = await getProductById(req.params.id)
    if (!current) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }

    const body = req.body ?? {}
    const patch = {}

    if (body.stock != null) {
      if (!can(req.user, 'stock')) {
        res.status(403).json({ error: 'No podés actualizar cantidades' })
        return
      }
      patch.stock = Number(body.stock)
    }

    if (body.sizes != null) {
      if (!can(req.user, 'sizes')) {
        res.status(403).json({ error: 'No podés modificar tallas' })
        return
      }
      patch.sizes = Array.isArray(body.sizes)
        ? body.sizes
        : String(body.sizes)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    }

    if (body.brand != null) {
      if (!can(req.user, 'brands') && !can(req.user, 'products')) {
        res.status(403).json({ error: 'No podés modificar marcas' })
        return
      }
      patch.brand = body.brand
    }

    const extraKeys = ['name', 'category', 'price', 'description', 'promo', 'images', 'colors', 'featured', 'compareAt', 'drop']
    if (extraKeys.some((key) => body[key] != null)) {
      if (!can(req.user, 'products')) {
        res.status(403).json({ error: 'No podés modificar el contenido del producto' })
        return
      }
      extraKeys.forEach((key) => {
        if (body[key] != null) patch[key] = body[key]
      })
      if (body.price != null) patch.price = Number(body.price)
    }

    if (!Object.keys(patch).length) {
      res.status(400).json({ error: 'No hay cambios o no tenés permiso para esos campos' })
      return
    }

    const product = await updateProduct(req.params.id, patch)
    await logAction(req, 'product_update', { id: req.params.id })
    res.json({ product })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAuth, requirePerm('products'), async (req, res, next) => {
  try {
    const current = await getProductById(req.params.id)
    if (!current) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }
    await deleteProduct(req.params.id)
    await logAction(req, 'product_delete', { id: req.params.id })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export const categoriesRouter = Router()

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    res.json({ categories: await listCategories() })
  } catch (error) {
    next(error)
  }
})

categoriesRouter.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim()
    if (!name) {
      res.status(400).json({ error: 'El nombre de la categoría es obligatorio' })
      return
    }
    const id = String(req.body?.id || name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
    await upsertCategory({ id, name, image: req.body?.image || null })
    await logAction(req, 'category_upsert', { id })
    res.status(201).json({ category: { id, name } })
  } catch (error) {
    next(error)
  }
})

export const storesRouter = Router()

storesRouter.get('/', async (_req, res, next) => {
  try {
    res.json({ stores: await listStores() })
  } catch (error) {
    next(error)
  }
})

export default router
