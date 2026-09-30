import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/cuenta'
  const [error, setError] = useState('')

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Cliente</p>
        <h1 className="display">Entrar</h1>
      </div>
      <p className="panel-hello">
        Podés mirar el catálogo sin cuenta. Para pagar, entrá o registrate: tu usuario queda como cliente.
      </p>
      <form
        className="form auth-form"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setError('')
          try {
            await login(data.get('email'), data.get('password'))
            navigate(next.startsWith('/') ? next : '/cuenta')
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <label>
          Correo
          <input type="email" name="email" required />
        </label>
        <label>
          Clave
          <input type="password" name="password" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-lime" type="submit">
          Entrar
        </button>
        <p>
          ¿No tenés cuenta? <Link to={`/registro${next !== '/cuenta' ? `?next=${encodeURIComponent(next)}` : ''}`}>Registrate</Link>
        </p>
      </form>
    </div>
  )
}
