import { randomUUID } from 'node:crypto'
import { insertAudit } from './db/queries.js'

export async function logAction(req, action, detail = {}) {
  if (!req.user) return
  await insertAudit({
    id: `log-${randomUUID().slice(0, 10)}`,
    userId: req.user.id,
    action,
    detail,
  })
}
