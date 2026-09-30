import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import HistoryFeed from '../components/HistoryFeed'

export default function AuditAdmin() {
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/api/auth/audit')
      .then((data) => setLogs(data.logs || []))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Administrador</p>
        <h1 className="display">Historial</h1>
      </div>
      <p className="panel-hello">
        En lenguaje claro: quién se registró, quién entró y qué cambió el equipo.{' '}
        <Link to="/admin/usuarios">Ver personas</Link>
      </p>
      <HistoryFeed logs={logs} error={error} />
    </div>
  )
}
