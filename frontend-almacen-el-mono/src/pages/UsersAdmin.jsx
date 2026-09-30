import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import HistoryFeed from '../components/HistoryFeed'
import { formatWhen } from '../data/history'
import { ALL_STAFF_PERMS, EXTRA_STAFF_PERMS, STAFF_PERMS, emptyWorkerPerms } from '../data/roles'

const ROLE_LABEL = {
  admin: 'Administrador',
  worker: 'Trabajador',
  client: 'Cliente',
}

function fold(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function Highlight({ text, q }) {
  const raw = String(text || '')
  const parts = fold(q).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return raw
  const source = fold(raw)
  let cursor = 0
  const nodes = []
  while (cursor < raw.length) {
    let best = -1
    let bestPart = ''
    for (const part of parts) {
      const at = source.indexOf(part, cursor)
      if (at !== -1 && (best === -1 || at < best)) {
        best = at
        bestPart = part
      }
    }
    if (best === -1) {
      nodes.push(raw.slice(cursor))
      break
    }
    if (best > cursor) nodes.push(raw.slice(cursor, best))
    nodes.push(
      <mark key={`${best}-${bestPart}`} className="search-mark">
        {raw.slice(best, best + bestPart.length)}
      </mark>,
    )
    cursor = best + bestPart.length
  }
  return nodes
}

function PermTiles({ value, onToggle }) {
  return (
    <div className="perm-tiles">
      {STAFF_PERMS.map((perm) => {
        const on = Boolean(value[perm.id])
        return (
          <label key={perm.id} className={`perm-tile ${on ? 'is-on' : ''}`}>
            <input type="checkbox" checked={on} onChange={() => onToggle(perm.id)} />
            <strong>{perm.label}</strong>
            <span>{perm.hint}</span>
          </label>
        )
      })}
    </div>
  )
}

export default function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [q, setQ] = useState('')
  const [role, setRole] = useState('client')
  const [status, setStatus] = useState('')
  const [pickedId, setPickedId] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [tab, setTab] = useState(() => (window.location.hash === '#historial' ? 'history' : 'people'))
  const [logs, setLogs] = useState([])
  const [logError, setLogError] = useState('')

  const load = () =>
    api('/api/auth/users').then((data) => {
      setUsers(data.users || [])
    })

  useEffect(() => {
    load().catch((err) => setError(err.message))
    api('/api/auth/audit')
      .then((data) => setLogs(data.logs || []))
      .catch((err) => setLogError(err.message))
  }, [])

  const found = useMemo(() => {
    const parts = fold(q).trim().split(/\s+/).filter(Boolean)
    return users.filter((user) => {
      if (role && user.role !== role) return false
      if (status && (user.status || 'active') !== status) return false
      if (!parts.length) return true
      const hay = fold([user.id, user.name, user.email].join(' '))
      return parts.every((part) => hay.includes(part))
    })
  }, [users, q, role, status])

  useEffect(() => {
    if (!found.length) {
      setPickedId(null)
      return
    }
    if (!found.some((user) => user.id === pickedId)) {
      setPickedId(found[0].id)
    }
  }, [found, pickedId])

  const recent = useMemo(
    () =>
      [...users]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 8),
    [users],
  )

  const save = async (user, patch, okMessage) => {
    setError('')
    setNotice('')
    try {
      const data = await api(`/api/auth/users/${user.id}`, { method: 'PATCH', body: patch })
      setUsers((list) => list.map((item) => (item.id === user.id ? data.user : item)))
      if (okMessage) setNotice(okMessage)
      api('/api/auth/audit')
        .then((data) => setLogs(data.logs || []))
        .catch(() => {})
      return data.user
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  const draftOf = (user) => drafts[user.id] || { ...emptyWorkerPerms(), ...user.permissions }

  const toggleDraft = (user, id) => {
    setDrafts((current) => {
      const base = current[user.id] || { ...emptyWorkerPerms(), ...user.permissions }
      return { ...current, [user.id]: { ...base, [id]: !base[id] } }
    })
  }

  const toggleSaved = (user, id) => {
    const next = { ...emptyWorkerPerms(), ...user.permissions, [id]: !user.permissions?.[id] }
    save(user, { role: 'worker', permissions: next }, `Permiso ${id} actualizado en ${user.name}.`)
  }

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Administrador</p>
        <h1 className="display">Personas e historial</h1>
      </div>
      <p className="panel-hello">
        Acá ves quién se registró, le das permisos y el historial de lo que pasó en el panel.
      </p>

      <div className="people-tabs">
        <button type="button" className={tab === 'people' ? 'is-on' : ''} onClick={() => setTab('people')}>
          Personas
        </button>
        <button type="button" className={tab === 'history' ? 'is-on' : ''} onClick={() => setTab('history')}>
          Historial
        </button>
      </div>

      {tab === 'history' && <HistoryFeed logs={logs} error={logError} />}

      {tab === 'people' && (
        <>
      <section className="recent-people">
        <h2 className="filter-title">Se registraron</h2>
        <p className="guide-line">Los más nuevos primero. Tocá una tarjeta para buscarla y darle permisos.</p>
        <div className="recent-grid">
          {recent.map((user) => (
            <button
              key={user.id}
              type="button"
              className="recent-card"
              onClick={() => {
                setRole(user.role)
                setQ(user.email)
                setPickedId(user.id)
              }}
            >
              <span className="history-avatar" aria-hidden>
                {(user.name || '?').slice(0, 1).toUpperCase()}
              </span>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
              <em>
                {ROLE_LABEL[user.role]} · {formatWhen(user.createdAt) || 'sin fecha'}
              </em>
            </button>
          ))}
          {!recent.length && <p className="panel-hello">Todavía no hay cuentas para mostrar.</p>}
        </div>
      </section>

      <ol className="how-steps">
        <li>
          <strong>1. Buscá</strong> al cliente. Cada letra filtra la lista: nombre, correo o ID.
        </li>
        <li>
          <strong>2. Tocá</strong> a la persona. Queda marcada en lima para no equivocarte.
        </li>
        <li>
          <strong>3. Marcá permisos concretos</strong> — Contenido, Publicidad, Marcas, Tallajes — y asignalo como trabajador.
        </li>
      </ol>

      <section className="form user-search">
        <h2 className="filter-title">Paso 1 · Buscar</h2>
        <label>
          Nombre, correo o identificador
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Ej: ana · gmail · usr-"
            autoComplete="off"
            autoFocus
          />
        </label>
        <label>
          Quiénes aparecen
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="client">Clientes (para darles permisos)</option>
            <option value="worker">Ya son trabajadores</option>
            <option value="">Todos</option>
            <option value="admin">Administradores</option>
          </select>
        </label>
        <label>
          Estado
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todas las cuentas</option>
            <option value="active">Activas</option>
            <option value="disabled">Deshabilitadas</option>
          </select>
        </label>
        <p className="search-count">
          {found.length === 0
            ? q.trim()
              ? `Nadie coincide con “${q.trim()}”. Probá otra palabra o el filtro “Todos”.`
              : 'Escribí arriba: van a aparecer acá las personas que coincidan.'
            : `${found.length} ${found.length === 1 ? 'coincidencia' : 'coincidencias'}. La primera queda seleccionada; tocá otra si no es esa.`}
        </p>
      </section>

      {error && <p className="form-error">{error}</p>}
      {notice && <p className="form-ok">{notice}</p>}

      <h2 className="filter-title">Paso 2 · Elegí a la persona</h2>
      <div className="staff-table">
        {found.map((user) => {
          const picked = pickedId === user.id
          return (
            <article key={user.id} className={`staff-row user-hit ${picked ? 'is-picked' : ''}`}>
              <button type="button" className="user-pick" onClick={() => setPickedId(user.id)}>
                <strong>
                  <Highlight text={user.name} q={q} />
                </strong>
                <p>
                  <Highlight text={user.email} q={q} />
                </p>
                <p>
                  ID {user.id} · {user.status === 'disabled' ? 'Cuenta deshabilitada' : 'Cuenta activa'}
                  {user.createdAt ? ` · ${formatWhen(user.createdAt)}` : ''}
                </p>
                <em>{ROLE_LABEL[user.role] || user.role}</em>
              </button>

              {picked && user.role === 'admin' && (
                <p className="panel-hello">Administrador: no se le cambian permisos desde acá.</p>
              )}

              {picked && user.role === 'client' && (
                <div className="staff-controls">
                  <p className="guide-line">
                    Marcá qué va a poder hacer. Sin marcar nada, entra al panel pero no edita catálogo ni publicidad.
                  </p>
                  <PermTiles value={draftOf(user)} onToggle={(id) => toggleDraft(user, id)} />
                  <button
                    className="btn btn-lime"
                    type="button"
                    onClick={() =>
                      save(
                        user,
                        { role: 'worker', permissions: draftOf(user) },
                        `${user.name} ya es trabajador con los permisos que marcaste.`,
                      )
                    }
                  >
                    Asignar como trabajador con estos permisos
                  </button>
                </div>
              )}

              {picked && user.role === 'worker' && (
                <div className="staff-controls">
                  <p className="guide-line">Activá o desactivá cada permiso. El cambio se guarda al instante.</p>
                  <PermTiles value={{ ...emptyWorkerPerms(), ...user.permissions }} onToggle={(id) => toggleSaved(user, id)} />
                  <details className="perm-more">
                    <summary>Otros (cantidades y medios sueltos)</summary>
                    {ALL_STAFF_PERMS.filter((perm) => perm.id === 'stock' || perm.id === 'media').map((perm) => (
                      <label key={perm.id} className="check">
                        <input
                          type="checkbox"
                          checked={Boolean(user.permissions?.[perm.id])}
                          onChange={() => toggleSaved(user, perm.id)}
                        />
                        {perm.label} — {perm.hint}
                      </label>
                    ))}
                  </details>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => save(user, { role: 'client' }, `${user.name} volvió a ser cliente.`)}
                  >
                    Quitar del equipo (volver a cliente)
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <form
        className="form"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setError('')
          setNotice('')
          try {
            const created = await api('/api/auth/users', {
              method: 'POST',
              body: {
                name: data.get('name'),
                email: data.get('email'),
                password: data.get('password'),
                role: data.get('role'),
                permissions: Object.fromEntries(ALL_STAFF_PERMS.map((perm) => [perm.id, data.get(perm.id) === 'on'])),
              },
            })
            event.currentTarget.reset()
            setUsers((list) => [created.user, ...list])
            setRole(created.user.role)
            setQ(created.user.email)
            setNotice(`Listo: ${created.user.email} aparece en los resultados.`)
            api('/api/auth/audit')
              .then((data) => setLogs(data.logs || []))
              .catch(() => {})
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <h2 className="filter-title">Opcional · Crear cuenta nueva</h2>
        <p className="panel-hello">Si ya se registró o compró, buscala arriba. Esto es solo para alguien que todavía no existe.</p>
        <label>
          Nombre
          <input name="name" required />
        </label>
        <label>
          Correo
          <input type="email" name="email" required />
        </label>
        <label>
          Clave inicial
          <input type="password" name="password" minLength={6} required />
        </label>
        <label>
          Rol inicial
          <select name="role" defaultValue="client">
            <option value="client">Cliente</option>
            <option value="worker">Trabajador</option>
          </select>
        </label>
        <p className="panel-hello">Si nace trabajador, marcá permisos:</p>
        {STAFF_PERMS.map((perm) => (
          <label key={perm.id} className="check">
            <input type="checkbox" name={perm.id} />
            {perm.label} — {perm.hint}
          </label>
        ))}
        {EXTRA_STAFF_PERMS.map((perm) => (
          <label key={perm.id} className="check">
            <input type="checkbox" name={perm.id} />
            {perm.label}
          </label>
        ))}
        <button className="btn btn-ghost" type="submit">
          Crear y mostrar en la lista
        </button>
      </form>
        </>
      )}
    </div>
  )
}
