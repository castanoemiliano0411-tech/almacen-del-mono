import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminAccount() {
  const { user, updateAccount, logout } = useAuth()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">{user.role === 'admin' ? 'Administrador' : 'Trabajador'}</p>
        <h1 className="display">Mi cuenta</h1>
      </div>
      <p className="panel-hello">
        {user.email}. {user.role === 'admin' ? 'Tenés el control general del sistema.' : 'Tus permisos los define el administrador.'}
      </p>
      <form
        className="form auth-form"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setError('')
          setNotice('')
          try {
            await updateAccount({
              name: data.get('name'),
              currentPassword: data.get('currentPassword') || undefined,
              newPassword: data.get('newPassword') || undefined,
            })
            event.currentTarget.reset()
            setNotice('Cuenta actualizada.')
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <label>
          Nombre
          <input name="name" defaultValue={user.name} required />
        </label>
        <label>
          Correo
          <input type="email" value={user.email} disabled />
        </label>
        <label>
          Clave actual (solo si vas a cambiarla)
          <input type="password" name="currentPassword" autoComplete="current-password" />
        </label>
        <label>
          Clave nueva
          <input type="password" name="newPassword" minLength={6} autoComplete="new-password" />
        </label>
        {error && <p className="form-error">{error}</p>}
        {notice && <p className="form-ok">{notice}</p>}
        <button className="btn btn-lime" type="submit">
          Guardar cuenta
        </button>
      </form>
      <button className="btn btn-ghost" type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
