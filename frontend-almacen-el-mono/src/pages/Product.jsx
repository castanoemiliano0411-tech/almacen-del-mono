import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categoryLabels, formatPrice, getProductById, products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function Product() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addItem } = useCart()
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!product) return
    setSize(product.sizes[0])
    setColor(product.colors[0])
    setQuantity(1)
    setAdded(false)
  }, [product])

  const related = useMemo(
    () => products.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 4),
    [product],
  )

  if (!product) {
    return (
      <div className="container empty">
        <h1 className="display">Prenda no encontrada</h1>
        <Link to="/tienda">Volver a la tienda</Link>
      </div>
    )
  }

  const onAdd = () => {
    addItem(product, { size, color, quantity })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="container">
      <div className="pdp">
        <div className="pdp-gallery">
          {product.images.map((src) => (
            <img key={src} src={src} alt={product.name} />
          ))}
        </div>
        <div className="pdp-info">
          <p className="eyebrow">{categoryLabels[product.category] || product.category}</p>
          <h1 className="display">{product.name}</h1>
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            {product.compareAt && <span className="compare">{formatPrice(product.compareAt)}</span>}
            {product.promo && (
              <span className="tag sale" style={{ position: 'static' }}>
                {product.promo}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--muted)', margin: '16px 0 24px' }}>{product.description}</p>
          <p className="eyebrow">Color</p>
          <div className="swatches">
            {product.colors.map((option) => (
              <button
                key={option}
                type="button"
                className={`color-btn ${color === option ? 'active' : ''}`}
                onClick={() => setColor(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="eyebrow">Talla</p>
          <div className="sizes">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                className={`size-btn ${size === option ? 'active' : ''}`}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="eyebrow">Cantidad</p>
          <div className="qty" style={{ marginBottom: 18 }}>
            <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))} aria-label="Menos">
              −
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((n) => n + 1)} aria-label="Más">
              +
            </button>
          </div>
          <button className="btn btn-accent" type="button" onClick={onAdd}>
            Añadir a la bolsa
          </button>
          <ul className="details-list">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
            <li>
              {product.rating} ★ · {product.reviews} reseñas
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 className="display">También te puede gustar</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {added && <div className="toast">Añadido a la bolsa</div>}
    </div>
  )
}
