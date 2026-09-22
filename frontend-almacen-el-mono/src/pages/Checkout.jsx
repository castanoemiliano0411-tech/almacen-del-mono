import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, FREE_SHIPPING_FROM } from '../data/products'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const [done, setDone] = useState(false)
  const shipping = total >= FREE_SHIPPING_FROM ? 0 : 12000

  if (!items.length && !done) {
    return (
      <div className="container empty">
        <h1 className="display">No hay prendas para pagar</h1>
        <Link to="/tienda">Volver a la tienda</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="container empty">
        <p className="eyebrow">Pedido confirmado</p>
        <h1 className="display">Gracias por tu compra</h1>
        <p style={{ color: 'var(--muted)', margin: '12px 0 24px' }}>
          Recibirás un correo con el detalle y, si pediste recoger, te escribimos al WhatsApp cuando esté en el local.
        </p>
        <Link className="btn btn-primary" to="/tienda">
          Seguir viendo
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Pago</p>
        <h1 className="display">Checkout</h1>
      </div>
      <div className="checkout-layout">
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault()
            clearCart()
            setDone(true)
          }}
        >
          <label>
            Nombre completo
            <input name="name" required placeholder="Emiliano" />
          </label>
          <label>
            Correo
            <input type="email" name="email" required placeholder="hola@correo.com" />
          </label>
          <label>
            Dirección
            <input name="address" required placeholder="Calle, número, ciudad" />
          </label>
          <label>
            Teléfono
            <input name="phone" required placeholder="300 000 0000" />
          </label>
          <button className="btn btn-lime" type="submit">
            Confirmar pedido
          </button>
        </form>
        <aside className="summary">
          <h2 className="display">Pedido</h2>
          {items.map((item) => (
            <div className="row" key={item.key}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="row total">
            <span>Total</span>
            <span>{formatPrice(total + shipping)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
