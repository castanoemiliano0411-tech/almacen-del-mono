import { createHmac, timingSafeEqual } from 'node:crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Decode(secret) {
  const cleaned = String(secret || '')
    .toUpperCase()
    .replace(/[^A-Z2-7]/g, '')
  let bits = ''
  for (const char of cleaned) {
    const index = ALPHABET.indexOf(char)
    if (index < 0) continue
    bits += index.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2))
  }
  return Buffer.from(bytes)
}

function hotp(key, counter) {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64BE(BigInt(counter))
  const digest = createHmac('sha1', key).update(buffer).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000
  return String(code).padStart(6, '0')
}

export function totpAt(secret, timestamp = Date.now(), step = 30) {
  const key = base32Decode(secret)
  const counter = Math.floor(timestamp / 1000 / step)
  return hotp(key, counter)
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left))
  const b = Buffer.from(String(right))
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function adminNeeds2fa() {
  return Boolean(process.env.ADMIN_2FA_CODE || process.env.ADMIN_TOTP_SECRET)
}

export function verifySecondFactor(code) {
  const cleaned = String(code || '').replace(/\s/g, '')
  const backup = process.env.ADMIN_2FA_CODE
  if (backup && safeEqual(cleaned, backup)) return true

  const secret = process.env.ADMIN_TOTP_SECRET
  if (!secret) return !backup

  const now = Date.now()
  for (const offset of [-1, 0, 1]) {
    if (safeEqual(cleaned, totpAt(secret, now + offset * 30_000))) return true
  }
  return false
}
