import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'
  const [error, setError] = useState('')

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Cliente</p>
        <h1 className="display">Crear cuenta</h1>
      </div>
      <p className="panel-hello">
        El registro te deja con rol de cliente: compras y tu cuenta. Sin acceso a operaciones internas.
      </p>
      <form
        className="form auth-form"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setError('')
          try {
            await register(data.get('name'), data.get('email'), data.get('password'))
            navigate(next.startsWith('/') ? next : '/')
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <label>
          Nombre
          <input name="name" required />
        </label>
        <label>
          Correo
          <input type="email" name="email" required />
        </label>
        <label>
          Clave
          <input type="password" name="password" minLength={6} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-lime" type="submit">
          Crear cuenta de cliente
        </button>
        <p>
          ¿Ya tenés usuario?{' '}
          <Link to={`/entrar${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}>Entrar</Link>
        </p>
      </form>
    </div>
  )
}
