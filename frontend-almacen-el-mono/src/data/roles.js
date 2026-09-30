export const STAFF_PERMS = [
  {
    id: 'content',
    label: 'Contenido',
    hint: 'Subir y editar prendas, fotos, precios y textos del catálogo.',
  },
  {
    id: 'ads',
    label: 'Publicidad',
    hint: 'Banners del inicio, marcas nuevas (logo y look) y productos de esas marcas.',
  },
  {
    id: 'brands',
    label: 'Marcas',
    hint: 'Crear marcas nuevas, su logo y asignar productos a esa marca.',
  },
  {
    id: 'sizes',
    label: 'Tallajes',
    hint: 'Tallas disponibles de cada prenda.',
  },
]

export const EXTRA_STAFF_PERMS = [
  { id: 'stock', label: 'Cantidades', hint: 'Stock de cada pieza.' },
  { id: 'media', label: 'Medios sueltos', hint: 'Galería de fotos y videos (si no tiene Contenido).' },
]

export const ALL_STAFF_PERMS = [...STAFF_PERMS, ...EXTRA_STAFF_PERMS]

export function emptyWorkerPerms() {
  return Object.fromEntries(ALL_STAFF_PERMS.map((perm) => [perm.id, false]))
}

export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    title: 'Administrador',
    email: 'admin@elalmacendelmono.com',
    password: 'MonoAdmin007!',
    canDo: 'Usuarios, productos, inventario y publicidad.',
  },
  {
    role: 'worker',
    title: 'Trabajador completo',
    email: 'trabajador@elalmacendelmono.com',
    password: 'MonoStaff007!',
    canDo: 'Productos, tallas, stock y publicidad. Sin usuarios.',
  },
  {
    role: 'worker',
    title: 'Trabajador (solo stock)',
    email: 'stock@elalmacendelmono.com',
    password: 'MonoStock007!',
    canDo: 'Solo actualizar cantidades. El resto queda bloqueado.',
  },
  {
    role: 'client',
    title: 'Cliente',
    email: 'cliente@elalmacendelmono.com',
    password: 'MonoCliente007!',
    canDo: 'Ver catálogo, comprar y ver pedidos. Sin panel.',
  },
]
