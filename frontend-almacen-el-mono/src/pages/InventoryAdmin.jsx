import { useEffect, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'

export default function InventoryAdmin() {
  const { can } = useAuth()
  const { refresh } = useCatalog()
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  const load = () => api('/api/products').then((data) => setProducts(data.products))

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [])

  const patch = async (id, body) => {
    setError('')
    try {
      const data = await api(`/api/products/${id}`, { method: 'PATCH', body })
      setProducts((list) => list.map((item) => (item.id === id ? data.product : item)))
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Staff</p>
        <h1 className="display">Inventario</h1>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="staff-table">
        {products.map((product) => (
          <article key={product.id} className="staff-row">
            <div>
              <strong>{product.name}</strong>
              <p>
                {product.brand} · {product.category}
              </p>
            </div>
            <div className="staff-controls">
              {can('stock') && (
                <label>
                  Cantidad
                  <input
                    type="number"
                    min="0"
                    defaultValue={product.stock}
                    onBlur={(event) => patch(product.id, { stock: Number(event.target.value) })}
                  />
                </label>
              )}
              {can('sizes') && (
                <label>
                  Tallas
                  <input
                    defaultValue={product.sizes.join(', ')}
                    onBlur={(event) => patch(product.id, { sizes: event.target.value })}
                  />
                </label>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
