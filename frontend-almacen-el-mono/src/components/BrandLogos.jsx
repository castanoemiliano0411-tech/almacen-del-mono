const LOGOS = {
  Adidas: { src: '/brands/adidas.webp', tone: 'dark' },
  Puma: { src: '/brands/puma.png', tone: 'light' },
  Nike: { src: '/brands/nike.png', tone: 'dark' },
  'Under Armour': { src: '/brands/under-armour.png', tone: 'dark' },
  Reebok: { src: '/brands/reebok.png', tone: 'dark' },
}

export default function BrandLogo({ brand }) {
  const logo = LOGOS[brand]
  if (!logo) return null

  return (
    <span className={`brand-logo-wrap brand-logo-${logo.tone}`}>
      <i className="brand-logo-halo" />
      <img
        className="brand-logo-img"
        src={logo.src}
        alt=""
        draggable="false"
      />
    </span>
  )
}
