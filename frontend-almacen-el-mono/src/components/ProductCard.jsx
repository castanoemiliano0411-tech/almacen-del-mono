import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

const swatch = {
  Negro: '#111',
  Blanco: '#f4f4f4',
  Gris: '#8a8a8a',
  Azul: '#3b6ea8',
  Verde: '#3f7a4a',
  Rojo: '#c1121f',
  Amarillo: '#e8c547',
  Beige: '#cbb79a',
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [added, setAdded] = useState(false)
  const alt = product.images[1]

  const onMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    setTilt({ x: y * -10, y: x * 12 })
  }

  const quickAdd = (event) => {
    event.preventDefault()
    event.stopPropagation()
    addItem(product, { size: product.sizes[0], color: product.colors[0], quantity: 1 })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <Link
      to={`/producto/${product.id}`}
      className="product-card"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className={`product-thumb ${alt ? 'has-alt' : ''}`}
        style={{ transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <img src={product.images[0]} alt={product.name} className="img-main" />
        {alt && <img src={alt} alt="" className="img-alt" />}
        {product.promo && <span className="tag sale">{product.promo}</span>}
        <div className="product-reveal">
          <p>{product.colors.join(' · ')}</p>
          <p>Tallas {product.sizes.join(' / ')}</p>
          {product.stock != null && <p>{product.stock} en este drop</p>}
          <button type="button" className="btn btn-lime" onClick={quickAdd}>
            {added ? 'Añadido' : 'Añadir'}
          </button>
        </div>
      </div>
      <p className="product-brand">{product.brand}</p>
      <h3>{product.name}</h3>
      <div className="price">
        <span>{formatPrice(product.price)}</span>
        {product.compareAt && <span className="compare">{formatPrice(product.compareAt)}</span>}
      </div>
      <div className="card-swatches" aria-hidden="true">
        {product.colors.map((color) => (
          <i key={color} style={{ background: swatch[color] || '#555' }} title={color} />
        ))}
      </div>
    </Link>
  )
}
