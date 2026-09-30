import { brandTestCatalog } from './brandTestCatalog.js'

export const FREE_SHIPPING_FROM = 150000
export const DROP_AT = '2026-09-25T12:00:00-05:00'
export const DROP_CODE = '007'

export const categories = [
  { id: 'mujer', name: 'Mujer' },
  { id: 'hombre', name: 'Hombre' },
  { id: 'drops', name: 'Drops' },
  { id: 'outfits', name: 'Outfits' },
  { id: 'accesorios', name: 'Accesorios' },
]

export const colorFilters = ['Negro', 'Blanco', 'Gris', 'Azul', 'Verde', 'Beige']
export const sizeFilters = ['XS', 'S', 'M', 'L', 'XL', '38', '39', '40', '41', '42', 'Único']

export const products = [
  {
    id: 'am-01',
    name: 'Jacket Coach Oversize',
    brand: 'El Mono Studio',
    category: 'hombre',
    drop: true,
    price: 340000,
    compareAt: null,
    promo: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Rojo'],
    featured: true,
    isNew: true,
    stock: 6,
    rating: 4.8,
    reviews: 18,
    description:
      'Coach jacket oversize del Drop 007. Capucha, corte de ski y nylon mate. Edición de 40 unidades; cuando se acaba, no vuelve.',
    details: ['Nylon mate', 'Hecha en Colombia', 'Drop 007 · Invierno 2025'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-02',
    name: 'Crop Top Rib Knit',
    brand: 'El Mono Mujer',
    category: 'mujer',
    drop: true,
    price: 71200,
    compareAt: 89000,
    promo: '-20%',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Amarillo', 'Negro'],
    featured: true,
    isNew: true,
    stock: 9,
    rating: 4.7,
    reviews: 24,
    description: 'Rib de algodón corto, hombro caído. El amarillo del drop se ve igual de vivo de noche que en la foto.',
    details: ['Algodón rib', 'Lavable a máquina', 'Drop 007'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-03',
    name: 'Sneaker Chunky Low',
    brand: 'El Mono Footwear',
    category: 'hombre',
    drop: true,
    price: 385000,
    compareAt: null,
    promo: null,
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Blanco', 'Gris'],
    featured: true,
    isNew: true,
    stock: 5,
    rating: 4.6,
    reviews: 11,
    description: 'Suela chunky, piel mixta y lengüeta alta. Un par por talla en el drop; no hay reposición.',
    details: ['Piel y mesh', 'Suela 4 cm', 'Drop 007'],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-04',
    name: 'Gorra Washed Cap',
    brand: 'El Mono Studio',
    category: 'accesorios',
    drop: false,
    price: 62000,
    compareAt: null,
    promo: null,
    sizes: ['Único'],
    colors: ['Gris', 'Negro'],
    featured: true,
    isNew: false,
    stock: 14,
    rating: 4.5,
    reviews: 31,
    description: 'Gorra lavada, visera curva, bordado AM chico. El gris sale casi blanco con el sol.',
    details: ['Algodón lavado', 'Ajuste metálico', 'Hecha en Colombia'],
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-05',
    name: 'Knit Colorblock',
    brand: 'El Mono Mujer',
    category: 'mujer',
    drop: true,
    price: 128000,
    compareAt: 182000,
    promo: '-30%',
    sizes: ['XS', 'S', 'M'],
    colors: ['Blanco', 'Negro', 'Beige'],
    featured: true,
    isNew: false,
    stock: 4,
    rating: 4.9,
    reviews: 16,
    description: 'Sweater de bloques. El -30% es real: se va del drop y no entra otra corrida.',
    details: ['Lana y acrílico', 'Lavado en frío', 'Sale'],
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-06',
    name: 'Tee Heavyweight',
    brand: 'El Mono Studio',
    category: 'hombre',
    drop: false,
    price: 78000,
    compareAt: null,
    promo: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Negro'],
    featured: true,
    isNew: false,
    stock: 22,
    rating: 4.6,
    reviews: 54,
    description: 'Jersey 280 g. Cae recta, cuello que no se deforma a la tercera lavada. El básico del rack.',
    details: ['Algodón 280 g', 'Lavable a máquina', 'Corte regular'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-07',
    name: 'Hoodie Hotel',
    brand: 'El Mono Studio',
    category: 'outfits',
    drop: true,
    price: 210000,
    compareAt: null,
    promo: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Negro'],
    featured: true,
    isNew: true,
    stock: 7,
    rating: 4.8,
    reviews: 9,
    description: 'La hoodie del hero: felpa pesada, estampado (HOTEL) al pecho. Una sola vez, Drop 007.',
    details: ['Felpa 400 g', 'Estampado a una tinta', 'Drop 007'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-08',
    name: 'Cargo Track Pants',
    brand: 'El Mono Mujer',
    category: 'outfits',
    drop: true,
    price: 165000,
    compareAt: null,
    promo: null,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Verde', 'Negro'],
    featured: false,
    isNew: true,
    stock: 8,
    rating: 4.4,
    reviews: 13,
    description: 'Pantalón cargo de sastrería street. Se arma con la hoodie Hotel o el crop rib.',
    details: ['Algodón twill', 'Bolsillos laterales', 'Drop 007'],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'pu-01',
    name: 'Suede Classic XXI',
    brand: 'Puma',
    category: 'hombre',
    drop: false,
    price: 389000,
    compareAt: null,
    promo: null,
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Negro', 'Azul'],
    featured: true,
    isNew: false,
    stock: 10,
    rating: 4.7,
    reviews: 62,
    description: 'La Suede de Puma. Gamuza, suela gum y forma que no pasa de moda. Entra cada mes, no es drop único.',
    details: ['Gamuza', 'Suela gum', 'Puma'],
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'pu-02',
    name: 'RS-X Efekt',
    brand: 'Puma',
    category: 'mujer',
    drop: false,
    price: 459000,
    compareAt: 520000,
    promo: '-12%',
    sizes: ['38', '39', '40', '41'],
    colors: ['Blanco', 'Gris'],
    featured: true,
    isNew: true,
    stock: 7,
    rating: 4.5,
    reviews: 28,
    description: 'Chunky Puma RS-X. Mesh, overlays y suela ancha. Sale puntual del rack de mujer.',
    details: ['Mesh y sintético', 'Suela RS', 'Puma'],
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ni-01',
    name: 'Dunk Low Retro',
    brand: 'Nike',
    category: 'hombre',
    drop: true,
    price: 620000,
    compareAt: null,
    promo: null,
    sizes: ['39', '40', '41', '42'],
    colors: ['Negro', 'Blanco'],
    featured: true,
    isNew: true,
    stock: 4,
    rating: 4.8,
    reviews: 41,
    description: 'Dunk Low panda. Cuero, collareta y la forma que todo el mundo pide. Cupo corto.',
    details: ['Cuero', 'Nike Dunk', 'Edición limitada en tienda'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ad-01',
    name: 'Samba OG',
    brand: 'Adidas',
    category: 'mujer',
    drop: false,
    price: 479000,
    compareAt: null,
    promo: null,
    sizes: ['38', '39', '40', '41'],
    colors: ['Blanco', 'Negro'],
    featured: true,
    isNew: false,
    stock: 12,
    rating: 4.9,
    reviews: 88,
    description: 'Samba OG. T-toe, serraje y suela gum. El par que se usa con todo.',
    details: ['Serraje y cuero', 'Adidas Originals', 'Suela gum'],
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'rb-01',
    name: 'Club C 85 Vintage',
    brand: 'Reebok',
    category: 'hombre',
    drop: false,
    price: 419000,
    compareAt: null,
    promo: null,
    sizes: ['39', '40', '41', '42'],
    colors: ['Blanco', 'Gris'],
    featured: true,
    isNew: true,
    stock: 9,
    rating: 4.6,
    reviews: 34,
    description: 'Club C 85 de Reebok. Cuero limpio, perfil bajo y look de cancha de los 80.',
    details: ['Cuero', 'Reebok Classics', 'Suela cupsole'],
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ua-01',
    name: 'Rival Fleece Hoodie',
    brand: 'Under Armour',
    category: 'hombre',
    drop: false,
    price: 279000,
    compareAt: null,
    promo: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris'],
    featured: true,
    isNew: true,
    stock: 11,
    rating: 4.5,
    reviews: 27,
    description: 'Hoodie Rival Fleece de Under Armour. Felpa densa, capucha a dos hojas y corte de gym que se usa en la calle.',
    details: ['Felpa UA', 'Under Armour', 'Ajuste oversized'],
    images: [
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ua-02',
    name: 'HOVR Sonic 6',
    brand: 'Under Armour',
    category: 'mujer',
    drop: false,
    price: 489000,
    compareAt: 560000,
    promo: '-13%',
    sizes: ['38', '39', '40', '41'],
    colors: ['Negro', 'Blanco'],
    featured: false,
    isNew: false,
    stock: 6,
    rating: 4.4,
    reviews: 15,
    description: 'Running HOVR de Under Armour. Ligera, suela reactiva y look técnico para diario.',
    details: ['HOVR foam', 'Under Armour', 'Mesh'],
    images: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'rb-02',
    name: 'BB 4000 II',
    brand: 'Reebok',
    category: 'mujer',
    drop: false,
    price: 399000,
    compareAt: null,
    promo: null,
    sizes: ['38', '39', '40'],
    colors: ['Blanco', 'Azul'],
    featured: false,
    isNew: false,
    stock: 7,
    rating: 4.3,
    reviews: 12,
    description: 'BB 4000 de Reebok. Basketball retro, collareta alta y paleta que pega con denim.',
    details: ['Cuero', 'Reebok', 'Mid cut'],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'pu-03',
    name: 'T7 Track Jacket',
    brand: 'Puma',
    category: 'outfits',
    drop: false,
    price: 289000,
    compareAt: 340000,
    promo: '-15%',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Verde'],
    featured: false,
    isNew: false,
    stock: 8,
    rating: 4.4,
    reviews: 22,
    description: 'Chaqueta T7 de Puma. Las rayas laterales, cierre completo y corte de archivo.',
    details: ['Poliéster', 'T7 archive', 'Puma'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  ...brandTestCatalog,
]

export function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getProductById(id) {
  return products.find((item) => item.id === id)
}

export const categoryLabels = {
  mujer: 'Mujer',
  hombre: 'Hombre',
  accesorios: 'Accesorios',
  drops: 'Drops',
  outfits: 'Outfits',
  novedades: 'Drops',
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'todo') return products
  if (categoryId === 'drops' || categoryId === 'novedades') return products.filter((item) => item.drop || item.isNew)
  if (categoryId === 'outfits') return products.filter((item) => item.category === 'outfits')
  if (categoryId === 'sale') return products.filter((item) => item.promo)
  return products.filter((item) => item.category === categoryId)
}

export const FEATURED_BRANDS = ['Puma', 'Nike', 'Adidas', 'Reebok', 'Under Armour']

export function getBrands() {
  return FEATURED_BRANDS
}

export function getProductsByBrand(brand) {
  if (!brand) return products
  return products.filter((item) => item.brand === brand)
}

export function searchProducts(list, query) {
  const term = query.trim().toLowerCase()
  if (!term) return list
  return list.filter((item) => {
    const kind = productKind(item)
    const haystack = [
      item.name,
      item.brand,
      item.category,
      categoryLabels[item.category],
      kind,
      KIND_LABELS[kind],
      item.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
}

const SHOE_SIZES = new Set(['38', '39', '40', '41', '42'])

export const PRODUCT_KINDS = [
  { id: 'calzado', name: 'Calzado' },
  { id: 'ropa', name: 'Ropa' },
  { id: 'gorras', name: 'Gorras' },
  { id: 'accesorios', name: 'Accesorios' },
  { id: 'relojes', name: 'Relojes' },
]

export const KIND_LABELS = Object.fromEntries(PRODUCT_KINDS.map((item) => [item.id, item.name]))

export function productKind(item) {
  if (item?.kind) return item.kind
  const blob = `${item?.name || ''} ${item?.description || ''}`.toLowerCase()
  if (/reloj/.test(blob)) return 'relojes'
  if (/gorra|cap\b|beanie|visor/.test(blob)) return 'gorras'
  if (item?.category === 'accesorios') return 'accesorios'
  if ((item?.sizes || []).some((size) => SHOE_SIZES.has(String(size)))) return 'calzado'
  return 'ropa'
}

export function productMatchesLine(item, lineId) {
  if (!lineId || lineId === 'todo') return true
  if (lineId === 'drops' || lineId === 'novedades') return Boolean(item.drop || item.isNew)
  if (lineId === 'sale') return Boolean(item.promo)
  return item.category === lineId
}

export function filterCatalog(
  list,
  { colors = [], sizes = [], brands = [], lines = [], kinds = [], minPrice = 0, maxPrice, saleOnly } = {},
) {
  return list.filter((item) => {
    if (saleOnly && !item.promo) return false
    if (minPrice && item.price < minPrice) return false
    if (maxPrice && item.price > maxPrice) return false
    if (colors.length && !item.colors.some((c) => colors.includes(c))) return false
    if (sizes.length && !item.sizes.some((s) => sizes.includes(s))) return false
    if (brands.length && !brands.includes(item.brand)) return false
    if (lines.length && !lines.some((line) => productMatchesLine(item, line))) return false
    if (kinds.length && !kinds.includes(productKind(item))) return false
    return true
  })
}

export function sortCatalog(list, orden) {
  const next = [...list]
  if (orden === 'precio-asc') next.sort((a, b) => a.price - b.price)
  else if (orden === 'precio-desc') next.sort((a, b) => b.price - a.price)
  else {
    next.sort((a, b) => {
      const score = (item) => Number(Boolean(item.isNew)) + Number(Boolean(item.drop)) * 2
      return score(b) - score(a)
    })
  }
  return next
}
