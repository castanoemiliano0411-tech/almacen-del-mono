import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categoryLabels, formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import ProductCard from '../components/ProductCard'
import MediaFrame from '../components/MediaFrame'
import { isVideoSrc } from '../data/media'

export default function Product() {
  const { id } = useParams()
  const { products, getProductById } = useCatalog()
  const { can, isStaff } = useAuth()
  const product = getProductById(id)
  const { addItem } = useCart()
  const { has, toggle } = useFavorites()
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })

  useEffect(() => {
    if (!product) return
    setSize(product.sizes[0])
    setColor(product.colors[0])
    setQuantity(1)
    setAdded(false)
    setActive(0)
  }, [product])

  const related = useMemo(
    () => products.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 3),
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

  const images = product.images
  const current = images[active] || images[0]

  const onAdd = () => {
    addItem(product, { size, color, quantity })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const pickColor = (option, index) => {
    setColor(option)
    if (images[index]) setActive(index)
  }

  const moveZoom = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    setZoom({
      on: true,
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    })
  }

  const step = (dir) => {
    setActive((currentIndex) => (currentIndex + dir + images.length) % images.length)
  }

  return (
    <div className="container">
      <div className="pdp">
        <div className="pdp-gallery">
          <div
            className={`pdp-stage ${zoom.on && !isVideoSrc(current) ? 'is-zoom' : ''}`}
            onMouseMove={isVideoSrc(current) ? undefined : moveZoom}
            onMouseLeave={() => setZoom({ on: false, x: 50, y: 50 })}
          >
            <MediaFrame
              src={current}
              alt={product.name}
              className={isVideoSrc(current) ? 'pdp-video' : ''}
            />
            {images.length > 1 && (
              <>
                <button type="button" className="pdp-nav prev" onClick={() => step(-1)} aria-label="Foto anterior">
                  ‹
                </button>
                <button type="button" className="pdp-nav next" onClick={() => step(1)} aria-label="Foto siguiente">
                  ›
                </button>
              </>
            )}
            <span className="pdp-hint desktop-only">{zoom.on ? 'Mueve el mouse para acercar' : 'Pasa el mouse para zoom'}</span>
          </div>
          {images.length > 1 && (
            <div className="pdp-thumbs">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={index === active ? 'active' : ''}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                >
                  <MediaFrame src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pdp-info">
          <p className="eyebrow">
            {product.brand} · {categoryLabels[product.category] || product.category}
          </p>
          <h1 className="display">{product.name}</h1>
          {isStaff && (
            <div className="staff-pdp-tools">
              <p>
                Vista pública · stock {product.stock}
                {product.drop ? ' · drop' : ''}
                {product.promo ? ` · ${product.promo}` : ''}
              </p>
              {(can('products') || can('brands')) && <Link to="/admin/productos">Editar en productos</Link>}
              {(can('stock') || can('sizes')) && <Link to="/admin/inventario">Inventario</Link>}
              <Link to="/tienda">Ver catálogo completo</Link>
            </div>
          )}
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            {product.compareAt && <span className="compare">{formatPrice(product.compareAt)}</span>}
            {product.promo && (
              <span className="tag sale" style={{ position: 'static' }}>
                {product.promo}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--muted)', margin: '16px 0 8px' }}>{product.description}</p>
          {product.stock != null && (
            <p className={`product-meta ${product.stock <= 4 ? 'stock-low' : ''}`} style={{ marginBottom: 20 }}>
              {product.stock <= 4
                ? `Quedan ${product.stock} — cuando se agota, no vuelve`
                : `${product.stock} en este drop`}
            </p>
          )}
          <p className="eyebrow">Color</p>
          <div className="swatches">
            {product.colors.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`color-btn ${color === option ? 'active' : ''}`}
                onClick={() => pickColor(option, index)}
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
          <div className="pdp-buy">
            <button className="btn btn-lime" type="button" onClick={onAdd}>
              🛒 {added ? 'Añadido' : 'Agregar al carrito'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => toggle(product.id)}>
              {has(product.id) ? '♡ En favoritos' : '♡ Guardar en favoritos'}
            </button>
          </div>
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
            <h2 className="display">Más del drop</h2>
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
