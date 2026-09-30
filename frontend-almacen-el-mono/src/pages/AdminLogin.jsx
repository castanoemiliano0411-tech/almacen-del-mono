import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconEye } from '../components/Icons'

export default function AdminLogin({ onClose }) {
  const { loginStaff, confirm2fa } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [needs2fa, setNeeds2fa] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form
      className="form auth-form secret-form"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setError('')
        try {
          if (!needs2fa) {
            const result = await loginStaff(data.get('email'), data.get('password'))
            if (result?.requires2fa) {
              setNeeds2fa(true)
              return
            }
            onClose?.()
            navigate('/admin/inicio', { replace: true })
            return
          }
          await confirm2fa(data.get('code'))
          onClose?.()
          navigate('/admin/inicio', { replace: true })
        } catch (err) {
          setError(err.message)
        }
      }}
    >
      <p className="eyebrow">Operaciones</p>
      <h1 className="display">Acceso interno</h1>
      <p className="panel-hello">
        Correo: <strong>almacendelmono.admin@gmail.com</strong>
      </p>
      {!needs2fa ? (
        <>
          <label>
            Correo
            <input
              name="email"
              required
              autoComplete="username"
              defaultValue="almacendelmono.admin@gmail.com"
            />
          </label>
          <label>
            Contraseña
            <span className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                autoComplete="current-password"
              />
              <button
                className="password-eye"
                type="button"
                aria-label="Mostrar contraseña"
                onPointerDown={(event) => {
                  event.preventDefault()
                  setShowPassword(true)
                }}
                onPointerUp={() => setShowPassword(false)}
                onPointerLeave={() => setShowPassword(false)}
                onPointerCancel={() => setShowPassword(false)}
              >
                <IconEye />
              </button>
            </span>
          </label>
        </>
      ) : (
        <label>
          Verificación adicional
          <input name="code" inputMode="numeric" autoComplete="one-time-code" required />
        </label>
      )}
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-lime" type="submit">
        {needs2fa ? 'Verificar' : 'Entrar'}
      </button>
    </form>
  )
}
