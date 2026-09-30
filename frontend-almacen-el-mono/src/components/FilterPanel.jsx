import { FEATURED_BRANDS, PRODUCT_KINDS, sizeFilters } from '../data/products'

const GENDERS = [
  { id: 'hombre', name: 'Hombre' },
  { id: 'mujer', name: 'Mujer' },
]

export default function FilterPanel({
  brands,
  selectedLines,
  selectedBrands,
  selectedKinds,
  selectedSizes,
  minPrice,
  maxPrice,
  saleOnly,
  orden,
  onToggle,
  onSale,
  onMin,
  onMax,
  onOrden,
  onClear,
  onApply,
}) {
  const brandList = FEATURED_BRANDS.filter((name) => brands.includes(name)).concat(
    brands.filter((name) => !FEATURED_BRANDS.includes(name)),
  )

  return (
    <div className="filter-panel">
      <div className="filter-block">
        <p className="filter-label">Categoría</p>
        {GENDERS.map((item) => (
          <label key={item.id} className="check">
            <input type="checkbox" checked={selectedLines.includes(item.id)} onChange={() => onToggle('categoria', item.id)} />
            {item.name}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <p className="filter-label">Marca</p>
        {brandList.map((brand) => (
          <label key={brand} className="check">
            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => onToggle('marca', brand)} />
            {brand}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <p className="filter-label">Tipo de producto</p>
        {PRODUCT_KINDS.map((item) => (
          <label key={item.id} className="check">
            <input type="checkbox" checked={selectedKinds.includes(item.id)} onChange={() => onToggle('tipo', item.id)} />
            {item.name}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <p className="filter-label">Talla</p>
        <div className="size-grid">
          {sizeFilters.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-chip ${selectedSizes.includes(size) ? 'active' : ''}`}
              onClick={() => onToggle('talla', size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <p className="filter-label">
          Precio <span>{Math.round(minPrice / 1000)}k – {Math.round(maxPrice / 1000)}k</span>
        </p>
        <label className="range-label">
          Desde
          <input className="range" type="range" min="0" max="620000" step="10000" value={minPrice} onChange={(event) => onMin(event.target.value)} />
        </label>
        <label className="range-label">
          Hasta
          <input className="range" type="range" min="0" max="620000" step="10000" value={maxPrice} onChange={(event) => onMax(event.target.value)} />
        </label>
      </div>

      <div className="filter-block">
        <p className="filter-label">Ordenar por</p>
        <select className="sort-select" value={orden} onChange={(event) => onOrden(event.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
        </select>
      </div>

      <label className="check sale-check">
        <input type="checkbox" checked={saleOnly} onChange={onSale} />
        Solo ofertas
      </label>

      {onApply && (
        <div className="filter-sheet-actions">
          <button type="button" className="btn btn-lime" onClick={onApply}>
            Aplicar filtros
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
