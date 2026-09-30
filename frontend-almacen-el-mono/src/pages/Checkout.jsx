import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { formatPrice, FREE_SHIPPING_FROM } from '../data/products'
import { api } from '../api'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user, ready } = useAuth()
  const { refresh } = useCatalog()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const shipping = total >= FREE_SHIPPING_FROM ? 0 : 12000

  if (ready && user && user.role !== 'client') {
    return (
      <div className="container empty">
        <h1 className="display">La compra es para clientes</h1>
        <Link to="/">Volver a la tienda</Link>
      </div>
    )
  }

  if (ready && !user) {
    return (
      <div className="container empty">
        <p className="eyebrow">Pago</p>
        <h1 className="display">Creá tu cuenta para pagar</h1>
        <p style={{ color: 'var(--muted)', margin: '12px 0 24px' }}>
          Podés ver la tienda sin registrarte. Al crear la cuenta quedás como cliente y recién ahí se confirma el pedido.
        </p>
        <Link className="btn btn-lime" to="/registro?next=/checkout">
          Crear cuenta
        </Link>
        <p style={{ marginTop: 16 }}>
          <Link to="/entrar?next=/checkout">Ya tengo cuenta</Link>
        </p>
      </div>
    )
  }

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
          El pedido quedó en tu cuenta. Si pediste recoger, te escribimos al WhatsApp.
        </p>
        <Link className="btn btn-lime" to="/cuenta">
          Ver mi cuenta
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
          onSubmit={async (event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            setError('')
            try {
              await api('/api/orders', {
                method: 'POST',
                body: {
                  name: data.get('name'),
                  email: data.get('email'),
                  address: data.get('address'),
                  phone: data.get('phone'),
                  items: items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                  })),
                },
              })
              clearCart()
              await refresh()
              setDone(true)
            } catch (err) {
              setError(err.message)
            }
          }}
        >
          <label>
            Nombre completo
            <input name="name" required defaultValue={user?.name || ''} />
          </label>
          <label>
            Correo
            <input type="email" name="email" required defaultValue={user?.email || ''} />
          </label>
          <label>
            Dirección
            <input name="address" required placeholder="Calle, número, ciudad" />
          </label>
          <label>
            Teléfono
            <input name="phone" required placeholder="300 000 0000" />
          </label>
          {error && <p className="form-error">{error}</p>}
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
