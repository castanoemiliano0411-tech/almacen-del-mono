import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { can, requireAuth } from '../auth.js'
import { logAction } from '../audit.js'
import { deleteBrand, findBrandByName, listBrands, slugBrand, updateBrand, upsertBrand } from '../db/queries.js'

const router = Router()

function canManageBrands(user) {
  return can(user, 'ads') || can(user, 'brands')
}

router.get('/', async (_req, res, next) => {
  try {
    res.json({ brands: await listBrands() })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!canManageBrands(req.user)) {
      res.status(403).json({ error: 'El administrador no habilitó marcas o publicidad para tu usuario' })
      return
    }
    const name = String(req.body?.name || '').trim()
    if (name.length < 2) {
      res.status(400).json({ error: 'El nombre de la marca es obligatorio' })
      return
    }
    if (await findBrandByName(name)) {
      res.status(409).json({ error: 'Esa marca ya existe' })
      return
    }
    const slug = slugBrand(name) || `marca-${randomUUID().slice(0, 6)}`
    const brand = await upsertBrand({
      id: `br-${randomUUID().slice(0, 8)}`,
      name,
      slug,
      image: String(req.body?.image || '').trim(),
      sortOrder: Number(req.body?.sortOrder || 100),
    })
    await logAction(req, 'brand_create', { id: brand.id, name: brand.name })
    res.status(201).json({ brand })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!canManageBrands(req.user)) {
      res.status(403).json({ error: 'El administrador no habilitó marcas o publicidad para tu usuario' })
      return
    }
    const patch = {}
    if (req.body?.name) {
      patch.name = String(req.body.name).trim()
      patch.slug = slugBrand(patch.name)
    }
    if (req.body?.image != null) patch.image = String(req.body.image).trim()
    if (req.body?.sortOrder != null) patch.sortOrder = Number(req.body.sortOrder)
    const brand = await updateBrand(req.params.id, patch)
    if (!brand) {
      res.status(404).json({ error: 'Marca no encontrada' })
      return
    }
    await logAction(req, 'brand_update', { id: brand.id, name: brand.name })
    res.json({ brand })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!canManageBrands(req.user)) {
      res.status(403).json({ error: 'El administrador no habilitó marcas o publicidad para tu usuario' })
      return
    }
    await deleteBrand(req.params.id)
    await logAction(req, 'brand_delete', { id: req.params.id })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
