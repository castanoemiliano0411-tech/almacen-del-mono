import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categories, getProductsByCategory, searchProducts } from '../data/products'

const filters = [{ id: 'todo', name: 'Todo' }, ...categories]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const current = params.get('categoria') || 'todo'
  const query = params.get('q') || ''

  const list = useMemo(
    () => searchProducts(getProductsByCategory(current), query),
    [current, query],
  )

  const setCategory = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'todo') next.delete('categoria')
    else next.set('categoria', id)
    setParams(next)
  }

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Catálogo</p>
        <h1 className="display">{query ? `Resultados para “${query}”` : 'Tienda'}</h1>
      </div>
      <div className="filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`chip ${current === filter.id ? 'active' : ''}`}
            type="button"
            onClick={() => setCategory(filter.id)}
          >
            {filter.name}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty">
          <p>No hay prendas para este filtro.</p>
        </div>
      ) : (
        <div className="product-grid" style={{ paddingBottom: 80 }}>
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
