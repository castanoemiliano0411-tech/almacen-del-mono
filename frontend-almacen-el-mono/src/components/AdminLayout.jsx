import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import PanelNav from './PanelNav'

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')
  }, [])

  return (
    <div className="admin-shell">
      <header className="admin-bar">
        <div className="admin-bar-links">
          <p>Operaciones · {user?.name}</p>
          <Link to="/">Ver tienda</Link>
          <Link to="/tienda">Catálogo en vivo</Link>
        </div>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={async () => {
            await logout()
            navigate('/', { replace: true })
          }}
        >
          Salir
        </button>
      </header>
      <main className="admin-main">
        <PanelNav />
        <Outlet />
      </main>
    </div>
  )
}
