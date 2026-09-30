export function formatWhen(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}

const ACTIONS = {
  register: { label: 'Se registró en la tienda', tone: 'lime' },
  user_create: { label: 'El admin creó una cuenta', tone: 'lime' },
  user_role: { label: 'Cambio de rol o permisos', tone: 'lime' },
  user_status: { label: 'Estado de la cuenta', tone: 'muted' },
  admin_login: { label: 'Entró al panel', tone: 'muted' },
  staff_login: { label: 'Trabajador entró al panel', tone: 'muted' },
  password_change: { label: 'Cambió la clave', tone: 'muted' },
  product_create: { label: 'Publicó un producto', tone: 'white' },
  product_update: { label: 'Editó un producto', tone: 'white' },
  product_delete: { label: 'Eliminó un producto', tone: 'warn' },
  category_upsert: { label: 'Guardó una categoría', tone: 'white' },
  ad_create: { label: 'Subió publicidad', tone: 'white' },
  brand_create: { label: 'Creó una marca', tone: 'lime' },
  brand_update: { label: 'Actualizó una marca', tone: 'white' },
  brand_delete: { label: 'Quitó una marca', tone: 'warn' },
  media_upload: { label: 'Subió fotos o videos', tone: 'white' },
  media_delete: { label: 'Borró un medio', tone: 'warn' },
}

export function historyTitle(action) {
  return ACTIONS[action]?.label || action.replaceAll('_', ' ')
}

export function historyTone(action) {
  return ACTIONS[action]?.tone || 'white'
}

export function historyDetail(log) {
  const d = log.detail || {}
  const bits = []
  if (d.name) bits.push(d.name)
  if (d.email) bits.push(d.email)
  if (d.role) bits.push(d.role === 'worker' ? 'trabajador' : d.role === 'client' ? 'cliente' : d.role)
  if (d.status) bits.push(d.status === 'disabled' ? 'deshabilitada' : 'activa')
  if (d.id) bits.push(d.id)
  if (d.count) bits.push(`${d.count} archivos`)
  if (d.via) bits.push('con segundo factor')
  return bits.join(' · ')
}
