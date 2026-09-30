import { Router } from 'express'
import { createMessage } from '../db/queries.js'

const router = Router()

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body ?? {}

    if (!name?.trim() || !isEmail(email) || !message?.trim()) {
      res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios' })
      return
    }

    const entry = {
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    }

    await createMessage(entry)
    res.status(201).json({ message: 'Recibido. Te respondemos en menos de un día hábil.', id: entry.id })
  } catch (error) {
    next(error)
  }
})

export default router
