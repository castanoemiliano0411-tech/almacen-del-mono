import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogos'
import { useCatalog } from '../context/CatalogContext'

function slug(brand) {
  return brand.toLowerCase().replace(/\s+/g, '-')
}

const LOOKS = {
  Puma: [
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80',
  ],
  Nike: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80',
  ],
  Adidas: [
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
  ],
  Reebok: [
    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
  ],
  'Under Armour': [
    'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
  ],
}

function brandShots(brand, catalog) {
  const fromCatalog = catalog
    .filter((item) => item.brand === brand)
    .flatMap((item) => item.images)
  return [...new Set([...fromCatalog, ...(LOOKS[brand] || [])])].slice(0, 4)
}

export default function BrandTile({ brand, index = 0, to, onClick }) {
  const { products, getBrand } = useCatalog()
  const meta = getBrand(brand)
  const shots = useMemo(() => brandShots(brand, products), [brand, products])
  const slides = useMemo(() => ['logo', ...shots], [shots])
  const count = products.filter((item) => item.brand === brand).length
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (!hovering || slides.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [active, hovering, slides.length])

  const className = `brand-tile brand-${slug(brand)} ${slides[active] === 'logo' ? 'is-logo' : ''}`
  const style = { '--i': index }
  const hover = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => {
      setHovering(false)
      setActive(0)
    },
    onFocus: () => setHovering(true),
    onBlur: () => {
      setHovering(false)
      setActive(0)
    },
  }
  const inner = (
    <>
      <div className="brand-slides">
        <div className={`brand-slide brand-logo-slide ${active === 0 ? 'is-on' : ''}`}>
          <BrandLogo brand={brand} image={meta?.image} />
        </div>
        {shots.map((src, shotIndex) => (
          <div
            key={src}
            className={`brand-slide ${active === shotIndex + 1 ? 'is-on' : ''}`}
          >
            <img src={src} alt="" className="brand-tile-img" />
          </div>
        ))}
      </div>
      <span className="brand-watermark" aria-hidden="true">
        {brand}
      </span>
      <span className="brand-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="brand-dots" aria-hidden="true">
        {slides.map((slide, slideIndex) => (
          <i key={`${slide}-${slideIndex}`} className={slideIndex === active ? 'is-on' : ''} />
        ))}
      </span>
      <span className="brand-marquee" aria-hidden="true">
        <b>
          {`${brand} · shop · `.repeat(6)}
          {`${brand} · shop · `.repeat(6)}
        </b>
      </span>
      <div className="brand-tile-copy">
        <strong>{brand}</strong>
        <em>{count} productos</em>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={className} style={style} onClick={onClick} {...hover}>
        {inner}
      </button>
    )
  }

  return (
    <Link className={className} style={style} to={to} {...hover}>
      {inner}
    </Link>
  )
}
