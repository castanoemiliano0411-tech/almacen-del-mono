import { mediaUrl } from '../data/media'

const LOGOS = {
  Adidas: { src: '/brands/adidas.webp', tone: 'dark' },
  Puma: { src: '/brands/puma.png', tone: 'light' },
  Nike: { src: '/brands/nike.png', tone: 'dark' },
  'Under Armour': { src: '/brands/under-armour.png', tone: 'dark' },
  Reebok: { src: '/brands/reebok.png', tone: 'dark' },
}

export default function BrandLogo({ brand, image }) {
  const packed = LOGOS[brand]
  const raw = image || packed?.src
  const src = raw?.startsWith('/uploads') || /^(https?:)/i.test(raw || '') ? mediaUrl(raw) : raw
  const tone = packed?.tone || 'dark'
  if (!src) {
    return (
      <span className={`brand-logo-wrap brand-logo-${tone} brand-logo-letter`}>
        <b>{String(brand || '?').slice(0, 1)}</b>
      </span>
    )
  }

  return (
    <span className={`brand-logo-wrap brand-logo-${tone}`}>
      <i className="brand-logo-halo" />
      <img className="brand-logo-img" src={src} alt="" draggable="false" />
    </span>
  )
}
