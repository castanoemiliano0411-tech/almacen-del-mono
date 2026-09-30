import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { requireAuth, requirePerm } from '../auth.js'
import { logAction } from '../audit.js'
import { deleteAd, insertAd, listActiveAds, listAds, setAdActive } from '../db/queries.js'

const router = Router()

router.get('/public', async (_req, res, next) => {
  try {
    res.json({ ads: await listActiveAds() })
  } catch (error) {
    next(error)
  }
})

router.get('/', requireAuth, requirePerm('ads'), async (_req, res, next) => {
  try {
    res.json({ ads: await listAds() })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, requirePerm('ads'), async (req, res, next) => {
  try {
    const { title, image, link, scheduleMode, startsAt, endsAt } = req.body ?? {}
    if (!title?.trim() || !image?.trim()) {
      res.status(400).json({ error: 'Título e imagen o video son obligatorios' })
      return
    }
    const mode = ['always', 'until', 'range'].includes(scheduleMode) ? scheduleMode : 'always'
    if (mode === 'until' && !endsAt) {
      res.status(400).json({ error: 'Indicá hasta cuándo se muestra' })
      return
    }
    if (mode === 'range' && (!startsAt || !endsAt)) {
      res.status(400).json({ error: 'Indicá inicio y fin del tiempo determinado' })
      return
    }
    if (mode === 'range' && new Date(endsAt) <= new Date(startsAt)) {
      res.status(400).json({ error: 'La fecha de fin debe ser posterior al inicio' })
      return
    }
    const ad = await insertAd({
      id: `ad-${randomUUID().slice(0, 8)}`,
      title: title.trim(),
      image: image.trim(),
      link: String(link || '/tienda').trim(),
      active: true,
      createdBy: req.user.id,
      scheduleMode: mode,
      startsAt: mode === 'range' ? startsAt : null,
      endsAt: mode === 'always' ? null : endsAt,
    })
    await logAction(req, 'ad_create', { id: ad.id })
    res.status(201).json({ ad })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', requireAuth, requirePerm('ads'), async (req, res, next) => {
  try {
    await setAdActive(req.params.id, Boolean(req.body?.active))
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAuth, requirePerm('ads'), async (req, res, next) => {
  try {
    await deleteAd(req.params.id)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
