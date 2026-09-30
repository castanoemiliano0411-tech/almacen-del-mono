import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import {
  FEATURED_BRANDS,
  filterCatalog,
  products as localProducts,
  searchProducts,
} from '../data/products'
import { useAuth } from './AuthContext'

const CatalogContext = createContext(null)

const FALLBACK_BRANDS = FEATURED_BRANDS.map((name, index) => ({
  id: `local-${index}`,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  image: '',
  sortOrder: index + 1,
}))

export function CatalogProvider({ children }) {
  const { user } = useAuth()
  const [products, setProducts] = useState(localProducts)
  const [brands, setBrands] = useState(FALLBACK_BRANDS)

  const refreshBrands = () =>
    api('/api/brands')
      .then((data) => {
        if (Array.isArray(data.brands) && data.brands.length) setBrands(data.brands)
      })
      .catch(() => {})

  const refresh = () =>
    Promise.all([
      api('/api/products')
        .then((data) => {
          if (Array.isArray(data.products)) setProducts(data.products)
        })
        .catch(() => {}),
      refreshBrands(),
    ])

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    const ms = user?.role === 'admin' || user?.role === 'worker' ? 8000 : 30000
    const timer = setInterval(refresh, ms)
    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(timer)
    }
  }, [user?.role])

  const storeBrands = useMemo(
    () =>
      [...brands]
        .filter((item) => !/^el mono\b/i.test(item.name))
        .sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100))
        .map((item) => item.name),
    [brands],
  )

  const value = useMemo(
    () => ({
      products,
      brands,
      refresh,
      refreshBrands,
      getProductById: (id) => products.find((item) => item.id === id),
      getBrands: () => storeBrands,
      getBrand: (name) => brands.find((item) => item.name === name),
      getProductsByCategory: (categoryId) => {
        if (!categoryId || categoryId === 'todo') return products
        if (categoryId === 'drops' || categoryId === 'novedades') {
          return products.filter((item) => item.drop || item.isNew)
        }
        if (categoryId === 'sale') return products.filter((item) => item.promo)
        return products.filter((item) => item.category === categoryId)
      },
      searchProducts,
      filterCatalog,
    }),
    [products, brands, storeBrands],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  return useContext(CatalogContext)
}
