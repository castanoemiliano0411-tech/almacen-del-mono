export const CATEGORY_RAIL = [
  { label: 'Hombre', to: '/tienda?categoria=hombre' },
  { label: 'Mujer', to: '/tienda?categoria=mujer' },
  { label: 'Calzado', to: '/tienda?tipo=calzado' },
  { label: 'Ropa', to: '/tienda?tipo=ropa' },
  { label: 'Gorras', to: '/tienda?tipo=gorras' },
  { label: 'Accesorios', to: '/tienda?tipo=accesorios' },
  { label: 'Relojes', to: '/tienda?tipo=relojes' },
  { label: 'Ofertas', to: '/tienda?sale=1' },
]

export const CLIENT_MENU = [
  {
    title: 'Tienda',
    items: [
      { label: 'Inicio', to: '/' },
      { label: 'Hombre', to: '/tienda?categoria=hombre' },
      { label: 'Mujer', to: '/tienda?categoria=mujer' },
      { label: 'Calzado', to: '/tienda?tipo=calzado' },
      { label: 'Ropa', to: '/tienda?tipo=ropa' },
      { label: 'Gorras', to: '/tienda?tipo=gorras' },
      { label: 'Accesorios', to: '/tienda?tipo=accesorios' },
      { label: 'Relojes', to: '/tienda?tipo=relojes' },
      { label: 'Ofertas', to: '/tienda?sale=1' },
    ],
  },
  {
    title: 'Tu cuenta',
    items: [
      { label: 'Favoritos', to: '/favoritos' },
      { label: 'Carrito', to: '/carrito', cart: true },
    ],
  },
  {
    title: 'Local',
    items: [
      { label: 'Tiendas físicas', to: '/#tiendas' },
      { label: 'Contacto', to: '/contacto' },
    ],
  },
]
