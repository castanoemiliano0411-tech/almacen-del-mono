export const categories = [
  { id: 'mujer', name: 'Mujer', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80' },
  { id: 'hombre', name: 'Hombre', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=900&q=80' },
  { id: 'accesorios', name: 'Accesorios', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80' },
  { id: 'novedades', name: 'Novedades', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
]

export const products = [
  {
    id: 'am-01',
    name: 'Chaqueta Lino Sahara',
    category: 'mujer',
    price: 189000,
    compareAt: 240000,
    promo: '-21%',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Arena', 'Oliva'],
    featured: true,
    isNew: true,
    rating: 4.8,
    reviews: 32,
    description:
      'Chaqueta de lino con corte relajado, bolsillos de parche y solapas suaves. Ideal para transicionar estaciones sin perder estructura.',
    details: ['100% lino', 'Lavado en seco recomendado', 'Hecha en Colombia'],
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-02',
    name: 'Camisa Oxford Mono',
    category: 'hombre',
    price: 98000,
    compareAt: null,
    promo: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Celeste'],
    featured: true,
    isNew: false,
    rating: 4.6,
    reviews: 48,
    description:
      'Oxford de algodón peinado con cuello button-down y silueta regular. El básico que se usa solo o bajo un saco.',
    details: ['100% algodón', 'Lavable a máquina', 'Botones de nácar'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-03',
    name: 'Vestido Midi Tostado',
    category: 'mujer',
    price: 165000,
    compareAt: 198000,
    promo: '-17%',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Tostado', 'Negro'],
    featured: true,
    isNew: true,
    rating: 4.9,
    reviews: 21,
    description:
      'Vestido midi de caída fluida, escote en V y cintura marcada. Un look de día que llega a la noche con un cinturón.',
    details: ['Viscosa ecológica', 'Forro interior', 'Cierre lateral oculto'],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-04',
    name: 'Pantalón Sastre Wide',
    category: 'mujer',
    price: 142000,
    compareAt: null,
    promo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Carbón', 'Crema'],
    featured: true,
    isNew: false,
    rating: 4.7,
    reviews: 19,
    description:
      'Pantalón de sastrería con pierna amplia y pinzas frontales. Cintura alta para alargar la silueta.',
    details: ['Lana y viscosa', 'Bolsillos laterales', 'Plancha profesional'],
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-05',
    name: 'Overshirt Denim Crudo',
    category: 'hombre',
    price: 175000,
    compareAt: 210000,
    promo: '-17%',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crudo', 'Índigo'],
    featured: true,
    isNew: true,
    rating: 4.5,
    reviews: 14,
    description:
      'Sobrecamisa de denim crudo con botones metálicos y bolsillos de fuelle. Gana carácter con cada lavado.',
    details: ['Denim 12 oz', 'Sin prelavar', 'Corte oversized'],
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542272454315-7f6c1b3c0c0b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-06',
    name: 'Bolso Saddle Cuero',
    category: 'accesorios',
    price: 220000,
    compareAt: null,
    promo: null,
    sizes: ['Único'],
    colors: ['Café', 'Negro'],
    featured: true,
    isNew: false,
    rating: 4.8,
    reviews: 27,
    description:
      'Bolso saddle de cuero vegetal con correa ajustable. Cabida para lo esencial sin perder forma.',
    details: ['Cuero vegetal', 'Forro de algodón', 'Herrajes en bronce'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a941954?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-07',
    name: 'Knit Polo Arena',
    category: 'hombre',
    price: 89000,
    compareAt: null,
    promo: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Arena', 'Verde'],
    featured: false,
    isNew: true,
    rating: 4.4,
    reviews: 11,
    description: 'Polo de punto fino, cuello acanalado y manga corta. Textura suave para el clima templado.',
    details: ['Algodón pima', 'Punto jersey', 'No planchar en caliente'],
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'am-08',
    name: 'Blusa Seda Cruda',
    category: 'mujer',
    price: 128000,
    compareAt: 155000,
    promo: '-17%',
    sizes: ['XS', 'S', 'M'],
    colors: ['Crudo', 'Terracota'],
    featured: false,
    isNew: false,
    rating: 4.6,
    reviews: 18,
    description: 'Blusa de seda cruda con lazo al cuello y puños suaves. Caída ligera y brillo mate.',
    details: ['Seda cruda', 'Lavado en seco', 'Corte regular'],
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
]

const categoryLabels = Object.fromEntries(categories.map((item) => [item.id, item.name]))

export function getProductById(id) {
  return products.find((item) => item.id === id)
}

export function filterProducts({ category, q, featured } = {}) {
  let list = products

  if (category && category !== 'todo') {
    list = category === 'novedades' ? list.filter((item) => item.isNew) : list.filter((item) => item.category === category)
  }

  if (featured === 'true' || featured === true) {
    list = list.filter((item) => item.featured)
  }

  const term = typeof q === 'string' ? q.trim().toLowerCase() : ''
  if (term) {
    list = list.filter((item) => {
      const haystack = [item.name, item.category, categoryLabels[item.category], item.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }

  return list
}
