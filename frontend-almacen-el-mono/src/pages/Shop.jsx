import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import BrandTile from '../components/BrandTile'
import { categories, categoryLabels, colorFilters, sizeFilters } from '../data/products'
import { useCatalog } from '../context/CatalogContext'

export default function Shop() {
  const { getBrands, searchProducts, filterCatalog, products } = useCatalog()
  const [params, setParams] = useSearchParams()
  const selectedLines = params.getAll('categoria').filter((id) => id && id !== 'sale')
  const query = params.get('q') || ''
  const saleOnly = params.get('categoria') === 'sale' || params.getAll('categoria').includes('sale') || params.get('sale') === '1'
  const selectedColors = params.getAll('color')
  const selectedSizes = params.getAll('talla')
  const selectedBrands = params.getAll('marca')
  const maxPrice = Number(params.get('max') || 620000)
  const brands = getBrands()
  const brandView = params.get('vista') === 'marcas' && selectedBrands.length === 0

  const list = useMemo(() => {
    const base = searchProducts(products, query)
    return filterCatalog(base, {
      colors: selectedColors,
      sizes: selectedSizes,
      brands: selectedBrands,
      lines: selectedLines,
      maxPrice,
      saleOnly,
    })
  }, [query, selectedColors, selectedSizes, selectedBrands, selectedLines, maxPrice, saleOnly, products])

  const toggle = (key, value) => {
    const next = new URLSearchParams(params)
    const values = next.getAll(key)
    next.delete(key)
    const has = values.includes(value)
    const updated = has ? values.filter((item) => item !== value) : [...values, value]
    updated.forEach((item) => next.append(key, item))
    setParams(next)
  }

  const setMax = (value) => {
    const next = new URLSearchParams(params)
    next.set('max', value)
    setParams(next)
  }

  const lineTitle = selectedLines.map((id) => categoryLabels[id] || id).filter(Boolean)
  const title =
    selectedBrands.length === 1
      ? selectedBrands[0]
      : saleOnly && !selectedLines.length && !query
        ? 'Sale'
        : lineTitle.length
          ? lineTitle.join(' · ')
          : brandView
            ? 'Marcas'
            : query
              ? `“${query}”`
              : 'Tienda'

  return (
    <div className="shop-layout">
      <aside className="shop-filters">
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

        <Link className="shop-home-link" to="/">
          <span>Volver al inicio</span>
        </Link>
        <Link className="shop-home-link is-ghost" to="/tienda">
          <span>Tienda principal</span>
        </Link>

        <div className="filter-block" style={{ '--i': 0 }}>
          <p className="filter-label">Línea</p>
          <p className="filter-hint">Podés marcar varios estilos a la vez.</p>
          {categories.map((item) => (
            <label key={item.id} className="check">
              <input
                type="checkbox"
                checked={selectedLines.includes(item.id)}
                onChange={() => toggle('categoria', item.id)}
              />
              {item.name}
            </label>
          ))}
        </div>

        <div className="filter-block" style={{ '--i': 1 }}>
          <p className="filter-label">Marca</p>
          {brands.map((brand) => (
            <label key={brand} className="check">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggle('marca', brand)}
              />
              {brand}
            </label>
          ))}
        </div>

        <div className="filter-block" style={{ '--i': 2 }}>
          <p className="filter-label">Color</p>
          {colorFilters.map((color) => (
            <label key={color} className="check">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() => toggle('color', color)}
              />
              {color}
            </label>
          ))}
        </div>

        <div className="filter-block" style={{ '--i': 3 }}>
          <p className="filter-label">Talla</p>
          <div className="size-grid">
            {sizeFilters.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-chip ${selectedSizes.includes(size) ? 'active' : ''}`}
                onClick={() => toggle('talla', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block" style={{ '--i': 4 }}>
          <p className="filter-label">
            Precio máx <span>${Math.round(maxPrice / 1000)}k</span>
          </p>
          <input
            className="range"
            type="range"
            min="0"
            max="620000"
            step="10000"
            value={maxPrice}
            onChange={(event) => setMax(event.target.value)}
          />
          <div className="range-scale">
            <span>$0</span>
            <span>$620k</span>
          </div>
        </div>

        <label className="check sale-check filter-block" style={{ '--i': 5 }}>
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={() => {
              const next = new URLSearchParams(params)
              if (saleOnly) {
                next.delete('sale')
                const cats = next.getAll('categoria').filter((id) => id !== 'sale')
                next.delete('categoria')
                cats.forEach((id) => next.append('categoria', id))
              } else {
                next.set('sale', '1')
              }
              setParams(next)
            }}
          />
          Solo con descuento
        </label>
      </aside>

      {list.length === 0 ? (
        <div className="empty">
          <p>No hay piezas con esos filtros.</p>
          <Link className="shop-home-link" to="/tienda">
            <span>Ir a la tienda principal</span>
          </Link>
        </div>
      ) : (
        <div>
          {brandView && (
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
          )}
          {!brandView && (
            <div className="product-grid shop-grid">
              {list.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
