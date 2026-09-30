import { Router } from 'express'
import {
  checkPassword,
  checkPasswordVariants,
  clearAuthCookie,
  clearPending2faCookie,
  DEFAULT_WORKER_PERMS,
  workerPermissions,
  hashPassword,
  newUserId,
  publicUser,
  readPending2fa,
  requireAuth,
  requireAdmin,
  setAuthCookie,
  setPending2faCookie,
} from '../auth.js'
import { adminNeeds2fa, verifySecondFactor } from '../totp.js'
import { staffLoginFailed, staffLoginGuard, staffLoginOk } from '../staffLock.js'
import { findStaffByIdentifier, findUserByEmail, findUserById, insertUser, listAuditLogs, listUsers, updateUserAccount, updateUserRole, updateUserStatus } from '../db/queries.js'
import { logAction } from '../audit.js'

const router = Router()

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {}
    if (!name?.trim() || !isEmail(email) || String(password || '').length < 6) {
      res.status(400).json({ error: 'Nombre, correo y clave de 6+ caracteres son obligatorios' })
      return
    }
    const normalized = email.trim().toLowerCase()
    if (await findUserByEmail(normalized)) {
      res.status(409).json({ error: 'Ese correo ya está registrado' })
      return
    }
    const user = await insertUser({
      id: newUserId(),
      name: name.trim(),
      email: normalized,
      passwordHash: await hashPassword(password),
      role: 'client',
      permissions: {},
    })
    await logAction({ user }, 'register', { name: user.name, email: user.email })
    setAuthCookie(res, user)
    res.status(201).json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    const user = await findUserByEmail(String(email || '').trim().toLowerCase())
    if (user && user.role !== 'client') {
      res.status(401).json({ error: 'Esta cuenta no entra desde Entrar. Usá el acceso interno.' })
      return
    }
    if (!user || user.status === 'disabled' || !(await checkPassword(password || '', user.passwordHash))) {
      res.status(401).json({ error: 'Correo o clave incorrectos' })
      return
    }
    setAuthCookie(res, user)
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/staff/login', staffLoginGuard, async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    const user = await findStaffByIdentifier(email)
    if (!user || user.status === 'disabled' || user.role === 'client' || !(await checkPasswordVariants(password || '', user.passwordHash))) {
      staffLoginFailed(req)
      res.status(401).json({ error: 'Correo o clave incorrectos' })
      return
    }
    staffLoginOk(req)
    if (user.role === 'admin' && adminNeeds2fa()) {
      setPending2faCookie(res, user)
      res.json({ requires2fa: true })
      return
    }
    setAuthCookie(res, user)
    await logAction({ user }, user.role === 'admin' ? 'admin_login' : 'staff_login', { role: user.role })
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/staff/2fa', async (req, res, next) => {
  try {
    const pending = readPending2fa(req)
    if (!pending?.id) {
      res.status(401).json({ error: 'Volvé a ingresar tu clave' })
      return
    }
    const user = await findUserById(pending.id)
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Verificación no válida' })
      return
    }
    if (!verifySecondFactor(req.body?.code)) {
      staffLoginFailed(req)
      res.status(401).json({ error: 'Código de verificación incorrecto' })
      return
    }
    staffLoginOk(req)
    clearPending2faCookie(res)
    setAuthCookie(res, user)
    await logAction({ user }, 'admin_login', { via: '2fa' })
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (_req, res) => {
  clearAuthCookie(res)
  clearPending2faCookie(res)
  res.json({ ok: true })
})

router.get('/me', (req, res) => {
  res.json({ user: publicUser(req.user) })
})

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    const currentPassword = String(req.body?.currentPassword || '')
    const newPassword = String(req.body?.newPassword || '')

    if (newPassword && newPassword.length < 6) {
      res.status(400).json({ error: 'La clave nueva debe tener 6+ caracteres' })
      return
    }

    if (newPassword) {
      if (!(await checkPassword(currentPassword, req.user.passwordHash))) {
        res.status(401).json({ error: 'La clave actual no es correcta' })
        return
      }
    }

    if (!name && !newPassword) {
      res.status(400).json({ error: 'No hay cambios para guardar' })
      return
    }

    const updated = await updateUserAccount(req.user.id, {
      name: name || undefined,
      passwordHash: newPassword ? await hashPassword(newPassword) : undefined,
    })
    if (newPassword) await logAction(req, 'password_change', {})
    res.json({ user: publicUser(updated) })
  } catch (error) {
    next(error)
  }
})

router.get('/users', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await listUsers({
      q: req.query.q,
      role: req.query.role,
      status: req.query.status,
    })
    res.json({ users: users.map(publicUser) })
  } catch (error) {
    next(error)
  }
})

router.get('/audit', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    res.json({ logs: await listAuditLogs() })
  } catch (error) {
    next(error)
  }
})

router.post('/users', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body ?? {}
    const nextRole = role === 'worker' ? 'worker' : role === 'client' ? 'client' : null
    if (!name?.trim() || !isEmail(email) || String(password || '').length < 6 || !nextRole) {
      res.status(400).json({ error: 'Nombre, correo, clave de 6+ y rol (trabajador o cliente) son obligatorios' })
      return
    }
    const normalized = email.trim().toLowerCase()
    if (await findUserByEmail(normalized)) {
      res.status(409).json({ error: 'Ese correo ya está registrado' })
      return
    }

    let permissions = {}
    if (nextRole === 'worker') {
      permissions = workerPermissions(req.body?.permissions || DEFAULT_WORKER_PERMS)
    }

    const user = await insertUser({
      id: newUserId(),
      name: name.trim(),
      email: normalized,
      passwordHash: await hashPassword(password),
      role: nextRole,
      permissions,
    })
    await logAction(req, 'user_create', { id: user.id, role: nextRole, name: user.name, email: user.email })
    res.status(201).json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.patch('/users/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const target = await findUserById(req.params.id)
    if (!target) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    if (target.role === 'admin') {
      res.status(403).json({ error: 'No se puede cambiar el rol de un administrador' })
      return
    }

    const role = req.body?.role
    if (role && !['client', 'worker'].includes(role)) {
      res.status(400).json({ error: 'Rol no válido' })
      return
    }

    const status = req.body?.status
    if (status && !['active', 'disabled'].includes(status)) {
      res.status(400).json({ error: 'Estado no válido' })
      return
    }

    if (status && !role) {
      const updated = await updateUserStatus(target.id, status)
      await logAction(req, 'user_status', { id: target.id, status })
      res.json({ user: publicUser(updated) })
      return
    }

    const nextRole = role || target.role
    let permissions = {}
    if (nextRole === 'worker') {
      const source = req.body?.permissions || (target.role === 'worker' ? target.permissions : DEFAULT_WORKER_PERMS)
      permissions = workerPermissions(source)
    }

    const updated = await updateUserRole(target.id, nextRole, permissions)
    if (status) await updateUserStatus(target.id, status)
    await logAction(req, 'user_role', { id: target.id, role: nextRole, name: target.name, email: target.email })
    res.json({ user: publicUser(status ? await findUserById(target.id) : updated) })
  } catch (error) {
    next(error)
  }
})

export default router
