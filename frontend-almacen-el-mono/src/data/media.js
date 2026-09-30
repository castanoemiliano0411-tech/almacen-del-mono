export function isVideoSrc(src) {
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(String(src || ''))
}

export function mediaUrl(src) {
  if (!src) return ''
  if (/^(https?:|blob:|data:)/i.test(src)) return src
  const base = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  if (src.startsWith('/')) return `${base}${src}`
  return src
}
