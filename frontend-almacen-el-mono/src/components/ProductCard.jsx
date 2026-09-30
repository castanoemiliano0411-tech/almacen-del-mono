import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import MediaFrame from './MediaFrame'

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

export default function ProductCard({ product, preview = false }) {
  const { addItem } = useCart()
  const { can, isStaff } = useAuth()
  const navigate = useNavigate()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [added, setAdded] = useState(false)
  const images = (product.images || []).filter(Boolean)
  const alt = images[1]

  const onMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    setTilt({ x: y * -10, y: x * 12 })
  }

  const quickAdd = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (preview) return
    addItem(product, { size: product.sizes?.[0], color: product.colors?.[0], quantity: 1 })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  const body = (
    <>
      <div
        className={`product-thumb ${alt ? 'has-alt' : ''}`}
        style={{ transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {images[0] ? (
          <MediaFrame src={images[0]} alt={product.name} className="img-main" />
        ) : (
          <div className="img-main product-thumb-empty">Foto o video</div>
        )}
        {alt && <MediaFrame src={alt} alt="" className="img-alt" />}
        {product.promo && <span className="tag sale">{product.promo}</span>}
        {isStaff && !preview && (
          <span className={`staff-live-tag ${product.stock <= 0 ? 'out' : ''}`}>
            {product.stock <= 0 ? 'Fuera' : `${product.stock} u.`}
          </span>
        )}
        {preview && <span className="preview-badge">Así se ve en la tienda · aún no publicado</span>}
        {!preview && (
          <div className="product-reveal">
            <p>{(product.colors || []).join(' · ')}</p>
            <p>Tallas {(product.sizes || []).join(' / ')}</p>
            {product.stock != null && <p>{product.stock} en este drop</p>}
            <button type="button" className="btn btn-lime" onClick={quickAdd}>
              {added ? 'Añadido' : 'Añadir'}
            </button>
            {can('products') && (
              <button
                type="button"
                className="staff-edit"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  navigate('/admin/productos')
                }}
              >
                Editar
              </button>
            )}
          </div>
        )}
      </div>
      <p className="product-brand">{product.brand || 'Marca'}</p>
      <h3>{product.name || 'Nombre del producto'}</h3>
      <div className="price">
        <span>{formatPrice(Number(product.price) || 0)}</span>
        {product.compareAt && <span className="compare">{formatPrice(product.compareAt)}</span>}
      </div>
      <div className="card-swatches" aria-hidden="true">
        {(product.colors || []).map((color) => (
          <i key={color} style={{ background: swatch[color] || '#555' }} title={color} />
        ))}
      </div>
    </>
  )

  const hover = {
    onMouseMove: onMove,
    onMouseLeave: () => setTilt({ x: 0, y: 0 }),
  }

  if (preview) {
    return (
      <article className="product-card is-preview" {...hover}>
        {body}
      </article>
    )
  }

  return (
    <Link to={`/producto/${product.id}`} className="product-card" {...hover}>
      {body}
    </Link>
  )
}
