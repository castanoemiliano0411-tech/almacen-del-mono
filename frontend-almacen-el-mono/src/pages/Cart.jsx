import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

export default function Cart() {
  const { items, updateQuantity, removeItem, total, count } = useCart()

  if (!items.length) {
    return (
      <div className="container empty">
        <p className="eyebrow">Bolsa</p>
        <h1 className="display">Tu bolsa está vacía</h1>
        <Link className="btn btn-primary" to="/tienda" style={{ marginTop: 20 }}>
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Bolsa</p>
        <h1 className="display">{count} {count === 1 ? 'prenda' : 'prendas'}</h1>
      </div>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <article className="cart-item" key={item.key}>
              <img src={item.image} alt={item.name} />
              <div>
                <h3>
                  <Link to={`/producto/${item.id}`}>{item.name}</Link>
                </h3>
                <p style={{ color: 'var(--muted)' }}>
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
                <button type="button" className="chip" style={{ marginTop: 10 }} onClick={() => removeItem(item.key)}>
                  Quitar
                </button>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>
        <aside className="summary">
          <h2 className="display">Resumen</h2>
          <div className="row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="row">
            <span>Envío</span>
            <span>{total >= 200000 ? 'Gratis' : formatPrice(12000)}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>{formatPrice(total + (total >= 200000 ? 0 : 12000))}</span>
          </div>
          <Link className="btn btn-accent" to="/checkout" style={{ marginTop: 16 }}>
            Continuar al pago
          </Link>
        </aside>
      </div>
    </div>
  )
}
