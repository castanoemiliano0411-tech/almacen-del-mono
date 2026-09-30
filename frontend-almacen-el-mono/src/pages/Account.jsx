import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import { formatPrice } from '../data/products'

export default function Account() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api('/api/orders/mine')
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
  }, [])

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Cliente</p>
        <h1 className="display">Mi cuenta</h1>
      </div>
      <p className="panel-hello">
        {user.name} · {user.email}. Como cliente podés comprar y ver tus pedidos. Las operaciones internas no están en este sitio.
      </p>
      <h2 className="filter-title">Pedidos</h2>
      {orders.length === 0 ? (
        <p className="panel-hello">Todavía no hay compras. <Link to="/tienda">Ir a la tienda</Link></p>
      ) : (
        <div className="staff-table">
          {orders.map((order) => (
            <article key={order.id} className="staff-row">
              <div>
                <strong>{order.id}</strong>
                <p>{formatPrice(order.total)} · {order.status}</p>
              </div>
            </article>
          ))}
        </div>
      )}
      <button className="btn btn-ghost" type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
