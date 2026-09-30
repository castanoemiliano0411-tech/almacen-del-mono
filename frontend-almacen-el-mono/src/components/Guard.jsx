import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Guard({ children, roles, perm, to = '/entrar' }) {
  const { user, ready, can } = useAuth()
  const needed = perm == null ? [] : Array.isArray(perm) ? perm : [perm]

  if (!ready) {
    return (
      <div className="container empty">
        <p>Cargando cuenta…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={to} replace />
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'client') return <Navigate to="/cuenta" replace />
    if (user.role === 'admin' || user.role === 'worker') {
      return <Navigate to="/admin/inicio" replace />
    }
    return <Navigate to="/" replace />
  }

  if (needed.length && user.role === 'client') {
    return <Navigate to="/cuenta" replace />
  }

  if (needed.length && !needed.some((item) => can(item))) {
    return (
      <div className="container empty">
        <h1 className="display">Sin permiso</h1>
        <p>El administrador no habilitó esta función para tu usuario.</p>
      </div>
    )
  }

  return children
}
