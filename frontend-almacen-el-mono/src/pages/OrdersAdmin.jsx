import { useEffect, useState } from 'react'
import { api } from '../api'

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/api/orders')
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Administrador</p>
        <h1 className="display">Pedidos</h1>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="staff-table">
        {orders.map((order) => (
          <article key={order.id} className="staff-row">
            <div>
              <strong>{order.id}</strong>
              <p>
                {order.customer?.name} · {order.customer?.email}
              </p>
              <em>
                {order.status} · ${Number(order.total).toLocaleString('es-CO')}
              </em>
            </div>
            <p>{order.items?.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
          </article>
        ))}
        {!orders.length && !error && <p className="panel-hello">Todavía no hay pedidos.</p>}
      </div>
    </div>
  )
}
