import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../pages/AdminLogin'

function isM(event) {
  return event.key === 'm' || event.key === 'M' || event.code === 'KeyM'
}

export default function SecretAccess() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const userRef = useRef(user)
  userRef.current = user

  const reveal = () => {
    if (userRef.current?.role === 'admin' || userRef.current?.role === 'worker') {
      navigate('/admin/inicio')
      return
    }
    setOpen(true)
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.repeat) return
      if (!event.ctrlKey || event.altKey || event.metaKey) return
      if (!isM(event)) return
      event.preventDefault()
      reveal()
    }

    const onGate = () => reveal()

    window.addEventListener('keydown', onKey, true)
    window.addEventListener('mono-staff-gate', onGate)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('mono-staff-gate', onGate)
    }
  }, [navigate])

  if (!open) return null

  return (
    <div className="secret-overlay" role="dialog" aria-modal="true" aria-label="Acceso interno">
      <button className="secret-dismiss" type="button" onClick={() => setOpen(false)}>
        Cerrar
      </button>
      <AdminLogin onClose={() => setOpen(false)} />
    </div>
  )
}
