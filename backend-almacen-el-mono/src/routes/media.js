import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import { requireAuth, requirePerm } from '../auth.js'
import { logAction } from '../audit.js'
import { deleteMedia, findMediaById, insertMedia, listMedia } from '../db/queries.js'

const router = Router()
const uploadDir = path.join(process.cwd(), 'uploads')
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
])

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.bin'
      cb(null, `${randomUUID()}${ext}`)
    },
  }),
  limits: { fileSize: 40 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new Error('Formato no permitido. Usá jpg, png, webp, gif, mp4 o webm.'))
  },
})

function kindOf(file) {
  return file.mimetype.startsWith('video/') ? 'video' : 'image'
}

router.get('/', requireAuth, requirePerm('media'), async (_req, res, next) => {
  try {
    res.json({ media: await listMedia() })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, requirePerm('media'), (req, res, next) => {
  upload.array('files', 8)(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message || 'No se pudo subir el archivo' })
      return
    }
    try {
      const files = req.files || []
      if (!files.length) {
        res.status(400).json({ error: 'Elegí al menos una imagen o un video' })
        return
      }
      const items = []
      for (const file of files) {
        const item = await insertMedia({
          id: `md-${randomUUID().slice(0, 8)}`,
          url: `/uploads/${file.filename}`,
          kind: kindOf(file),
          originalName: file.originalname || file.filename,
          createdBy: req.user.id,
        })
        items.push(item)
      }
      await logAction(req, 'media_upload', { count: items.length })
      res.status(201).json({ media: items })
    } catch (error) {
      next(error)
    }
  })
})

router.delete('/:id', requireAuth, requirePerm('media'), async (req, res, next) => {
  try {
    const item = await findMediaById(req.params.id)
    if (!item) {
      res.status(404).json({ error: 'Archivo no encontrado' })
      return
    }
    const filename = path.basename(item.url)
    const disk = path.join(uploadDir, filename)
    try {
      unlinkSync(disk)
    } catch {
      // el archivo ya no está en disco
    }
    await deleteMedia(item.id)
    await logAction(req, 'media_delete', { id: item.id })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
