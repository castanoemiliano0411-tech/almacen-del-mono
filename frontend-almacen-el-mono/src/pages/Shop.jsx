import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import BrandTile from '../components/BrandTile'
import CategoryRail from '../components/CategoryRail'
import FilterPanel from '../components/FilterPanel'
import { categoryLabels, sortCatalog } from '../data/products'
import { useCatalog } from '../context/CatalogContext'

export default function Shop() {
  const { getBrands, searchProducts, filterCatalog, products } = useCatalog()
  const [params, setParams] = useSearchParams()
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('nav-lock', sheetOpen)
    return () => document.body.classList.remove('nav-lock')
  }, [sheetOpen])
  const selectedLines = params.getAll('categoria').filter((id) => id && id !== 'sale')
  const selectedKinds = params.getAll('tipo')
  const query = params.get('q') || ''
  const saleOnly = params.get('categoria') === 'sale' || params.getAll('categoria').includes('sale') || params.get('sale') === '1'
  const selectedColors = params.getAll('color')
  const selectedSizes = params.getAll('talla')
  const selectedBrands = params.getAll('marca')
  const minPrice = Number(params.get('min') || 0)
  const maxPrice = Number(params.get('max') || 620000)
  const orden = params.get('orden') || 'recientes'
  const brands = getBrands()
  const brandView = params.get('vista') === 'marcas' && selectedBrands.length === 0

  const list = useMemo(() => {
    const base = searchProducts(products, query)
    const filtered = filterCatalog(base, {
      colors: selectedColors,
      sizes: selectedSizes,
      brands: selectedBrands,
      lines: selectedLines,
      kinds: selectedKinds,
      minPrice,
      maxPrice,
      saleOnly,
    })
    return sortCatalog(filtered, orden)
  }, [
    query,
    selectedColors,
    selectedSizes,
    selectedBrands,
    selectedLines,
    selectedKinds,
    minPrice,
    maxPrice,
    saleOnly,
    orden,
    products,
  ])

  const setParamsMap = (mutator) => {
    const next = new URLSearchParams(params)
    mutator(next)
    setParams(next)
  }

  const toggle = (key, value) => {
    setParamsMap((next) => {
      const values = next.getAll(key)
      next.delete(key)
      const has = values.includes(value)
      const updated = has ? values.filter((item) => item !== value) : [...values, value]
      updated.forEach((item) => next.append(key, item))
    })
  }

  const setMin = (value) => {
    setParamsMap((next) => {
      const n = Number(value)
      if (!n) next.delete('min')
      else next.set('min', String(Math.min(n, maxPrice)))
    })
  }

  const setMax = (value) => {
    setParamsMap((next) => next.set('max', String(Math.max(Number(value), minPrice))))
  }

  const setOrden = (value) => {
    setParamsMap((next) => {
      if (value === 'recientes') next.delete('orden')
      else next.set('orden', value)
    })
  }

  const onSale = () => {
    setParamsMap((next) => {
      if (saleOnly) {
        next.delete('sale')
        const cats = next.getAll('categoria').filter((id) => id !== 'sale')
        next.delete('categoria')
        cats.forEach((id) => next.append('categoria', id))
      } else next.set('sale', '1')
    })
  }

  const clearFilters = () => {
    setParams(new URLSearchParams())
    setSheetOpen(false)
  }

  const lineTitle = selectedLines.map((id) => categoryLabels[id] || id).filter(Boolean)
  const title =
    selectedBrands.length === 1
      ? selectedBrands[0]
      : saleOnly && !selectedLines.length && !query
        ? 'Ofertas'
        : lineTitle.length
          ? lineTitle.join(' · ')
          : brandView
            ? 'Marcas'
            : query
              ? `“${query}”`
              : 'Tienda'

  const filterProps = {
    brands,
    selectedLines,
    selectedBrands,
    selectedKinds,
    selectedSizes,
    minPrice,
    maxPrice,
    saleOnly,
    orden,
    onToggle: toggle,
    onSale,
    onMin: setMin,
    onMax: setMax,
    onOrden: setOrden,
    onClear: clearFilters,
  }

  return (
    <div className="shop-layout">
      <aside className="shop-filters desktop-filters">
        <p className="shop-crumb">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/tienda">Tienda</Link>
          {title !== 'Tienda' && (
            <>
              <span aria-hidden="true"> / </span>
              <em>{title}</em>
            </>
          )}
        </p>
        <p className="filter-title">{title}</p>
        <FilterPanel {...filterProps} />
        <button type="button" className="btn btn-ghost" style={{ marginTop: 12, width: '100%' }} onClick={clearFilters}>
          Limpiar filtros
        </button>
      </aside>

      <div className="shop-main">
        <div className="store-intro">
          <h1>Almacén El Mono</h1>
          <p>Encuentra tu estilo en un solo lugar.</p>
        </div>
        <CategoryRail />
        <div className="shop-toolbar">
          <button type="button" className="btn btn-ghost filter-trigger" onClick={() => setSheetOpen(true)}>
            ☰ Filtros
          </button>
          <label className="sort-inline">
            Ordenar
            <select value={orden} onChange={(event) => setOrden(event.target.value)}>
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <div className="empty">
            <p>No hay piezas con esos filtros.</p>
            <Link className="shop-home-link" to="/tienda">
              <span>Ir a la tienda principal</span>
            </Link>
          </div>
        ) : brandView ? (
          <div className="brand-grid">
            {brands.map((brand, index) => (
              <BrandTile
                key={brand}
                brand={brand}
                index={index}
                onClick={() => {
                  const next = new URLSearchParams(params)
                  next.delete('marca')
                  next.append('marca', brand)
                  setParams(next)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="product-grid shop-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {sheetOpen && (
        <div className="filter-sheet-root">
          <button type="button" className="filter-sheet-backdrop" aria-label="Cerrar filtros" onClick={() => setSheetOpen(false)} />
          <aside className="filter-sheet" role="dialog" aria-label="Filtros">
            <div className="filter-sheet-handle" aria-hidden="true" />
            <header className="filter-sheet-head">
              <div>
                <p className="eyebrow">Armá tu búsqueda</p>
                <h2>Filtros</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setSheetOpen(false)} aria-label="Cerrar">
                ×
              </button>
            </header>
            <FilterPanel {...filterProps} onApply={() => setSheetOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  )
}
