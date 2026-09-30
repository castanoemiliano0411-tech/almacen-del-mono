import { useMemo, useState } from 'react'
import { formatWhen, historyDetail, historyTitle, historyTone } from '../data/history'

export default function HistoryFeed({ logs, error }) {
  const [q, setQ] = useState('')

  const found = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return logs
    return logs.filter((log) =>
      [log.actorName, log.actorEmail, log.action, historyTitle(log.action), historyDetail(log)]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [logs, q])

  return (
    <div className="history-board">
      <label className="history-search">
        Buscar en el historial
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Nombre, correo o tipo de acción"
          autoComplete="off"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <div className="history-list">
        {found.map((log) => (
          <article key={log.id} className={`history-card tone-${historyTone(log.action)}`}>
            <span className="history-avatar" aria-hidden>
              {(log.actorName || '?').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{historyTitle(log.action)}</strong>
              <p>
                {log.actorName}
                {log.actorEmail ? ` · ${log.actorEmail}` : ''}
              </p>
              {historyDetail(log) && <p className="history-extra">{historyDetail(log)}</p>}
            </div>
            <em>{formatWhen(log.createdAt)}</em>
          </article>
        ))}
        {!found.length && !error && (
          <p className="panel-hello">
            {q.trim() ? 'Nada coincide con esa búsqueda.' : 'Todavía no hay movimientos. Cuando alguien se registre o el equipo trabaje, aparece acá.'}
          </p>
        )}
      </div>
    </div>
  )
}
