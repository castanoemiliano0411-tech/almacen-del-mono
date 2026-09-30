import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, FREE_SHIPPING_FROM } from '../data/products'
import { mediaUrl } from '../data/media'

export default function CartDrawer() {
  const { items, updateQuantity, removeItem, total, shipping, count, open, closeCart } = useCart()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="cart-drawer-root">
      <button type="button" className="cart-backdrop" aria-label="Cerrar carrito" onClick={closeCart} />
      <aside className="cart-drawer" role="dialog" aria-label="Carrito de compras">
        <header className="cart-drawer-head">
          <div>
            <p className="eyebrow">Carrito</p>
            <h2>{count === 0 ? 'Vacío' : `${count} ${count === 1 ? 'pieza' : 'piezas'}`}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={closeCart} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="cart-drawer-list">
          {items.length === 0 ? (
            <p className="cart-empty-copy">Aún no hay compras. Elige una marca o un drop y añade a la bolsa.</p>
          ) : (
            items.map((item) => (
              <article className="cart-drawer-item" key={item.key}>
                <img src={mediaUrl(item.image)} alt={item.name} />
                <div>
                  {item.brand && <p className="product-brand">{item.brand}</p>}
                  <h3>
                    <Link to={`/producto/${item.id}`} onClick={closeCart}>
                      {item.name}
                    </Link>
                  </h3>
                  <p>
                    {item.color} · {item.size}
                  </p>
                  <div className="qty">
                    <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Menos">
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Más">
                      +
                    </button>
                  </div>
                  <button type="button" className="chip" onClick={() => removeItem(item.key)}>
                    Quitar
                  </button>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </article>
            ))
          )}
        </div>

        <footer className="cart-drawer-foot">
          <div className="row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="row">
            <span>Envío</span>
            <span>
              {total === 0
                ? '—'
                : total >= FREE_SHIPPING_FROM
                  ? 'Gratis'
                  : formatPrice(shipping)}
            </span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>{formatPrice(total + shipping)}</span>
          </div>
          <Link className="btn btn-lime" to="/checkout" onClick={closeCart}>
            Ir a pagar
          </Link>
          <Link className="btn btn-ghost" to="/carrito" onClick={closeCart}>
            Ver carrito
          </Link>
        </footer>
      </aside>
    </div>
  )
}
