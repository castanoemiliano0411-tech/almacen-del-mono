import { FEATURED_BRANDS, PRODUCT_KINDS, sizeFilters } from '../data/products'

const GENDERS = [
  { id: 'hombre', name: 'Hombre' },
  { id: 'mujer', name: 'Mujer' },
]

function Pills({ items, selected, onToggle, keyName }) {
  return (
    <div className="filter-pills">
      {items.map((item) => {
        const id = item.id || item
        const label = item.name || item
        const on = selected.includes(id)
        return (
          <button
            key={id}
            type="button"
            className={`filter-pill ${on ? 'is-on' : ''}`}
            onClick={() => onToggle(keyName, id)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

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
  const sheet = Boolean(onApply)

  return (
    <div className={`filter-panel ${sheet ? 'is-sheet' : ''}`}>
      {sheet && (
        <p className="filter-guide">
          Tocá todo lo que quieras a la vez: hombre y mujer, dos marcas, varias tallas. Lo marcado se pone lima.
        </p>
      )}

      <div className="filter-block" style={{ '--i': 0 }}>
        <p className="filter-label">Categoría</p>
        {sheet && <p className="filter-hint">Podés marcar las dos.</p>}
        {sheet ? (
          <Pills items={GENDERS} selected={selectedLines} onToggle={onToggle} keyName="categoria" />
        ) : (
          GENDERS.map((item) => (
            <label key={item.id} className="check">
              <input type="checkbox" checked={selectedLines.includes(item.id)} onChange={() => onToggle('categoria', item.id)} />
              {item.name}
            </label>
          ))
        )}
      </div>

      <div className="filter-block" style={{ '--i': 1 }}>
        <p className="filter-label">Marca</p>
        {sheet && <p className="filter-hint">Nike, Adidas y las que haya en tienda. Varias a la vez.</p>}
        {sheet ? (
          <Pills items={brandList} selected={selectedBrands} onToggle={onToggle} keyName="marca" />
        ) : (
          brandList.map((brand) => (
            <label key={brand} className="check">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => onToggle('marca', brand)} />
              {brand}
            </label>
          ))
        )}
      </div>

      <div className="filter-block" style={{ '--i': 2 }}>
        <p className="filter-label">Tipo de producto</p>
        {sheet && <p className="filter-hint">Calzado, ropa, gorras… combiná sin problema.</p>}
        {sheet ? (
          <Pills items={PRODUCT_KINDS} selected={selectedKinds} onToggle={onToggle} keyName="tipo" />
        ) : (
          PRODUCT_KINDS.map((item) => (
            <label key={item.id} className="check">
              <input type="checkbox" checked={selectedKinds.includes(item.id)} onChange={() => onToggle('tipo', item.id)} />
              {item.name}
            </label>
          ))
        )}
      </div>

      <div className="filter-block" style={{ '--i': 3 }}>
        <p className="filter-label">Talla</p>
        {sheet && <p className="filter-hint">Elegí todas las que uses.</p>}
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

      <div className="filter-block" style={{ '--i': 4 }}>
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

      <div className="filter-block" style={{ '--i': 5 }}>
        <p className="filter-label">Ordenar por</p>
        <select className="sort-select" value={orden} onChange={(event) => onOrden(event.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
        </select>
      </div>

      <button type="button" className={`filter-pill sale-pill ${saleOnly ? 'is-on' : ''}`} onClick={onSale}>
        Solo ofertas
      </button>

      {onApply && (
        <div className="filter-sheet-actions">
          <button type="button" className="btn btn-lime" onClick={onApply}>
            Ver productos
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  )
}
