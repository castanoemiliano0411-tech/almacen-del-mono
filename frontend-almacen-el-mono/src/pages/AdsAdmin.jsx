import { useEffect, useState } from 'react'
import { api, uploadFiles } from '../api'
import MediaFrame from '../components/MediaFrame'
import { useAuth } from '../context/AuthContext'
import BrandsAdmin from './BrandsAdmin'

function scheduleLabel(ad) {
  if (!ad.active) return 'Oculta a mano'
  if (!ad.live) return 'Fuera de horario'
  if (ad.scheduleMode === 'always') return 'Visible siempre'
  if (ad.scheduleMode === 'until') {
    return `Hasta que se acabe · ${ad.endsAt ? new Date(ad.endsAt).toLocaleString('es-CO') : ''}`
  }
  return `Tiempo determinado · ${ad.startsAt ? new Date(ad.startsAt).toLocaleString('es-CO') : ''} → ${
    ad.endsAt ? new Date(ad.endsAt).toLocaleString('es-CO') : ''
  }`
}

export default function AdsAdmin() {
  const { can } = useAuth()
  const [ads, setAds] = useState([])
  const [error, setError] = useState('')
  const [image, setImage] = useState('')
  const [scheduleMode, setScheduleMode] = useState('always')

  const load = () => api('/api/ads').then((data) => setAds(data.ads))

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [])

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Staff</p>
        <h1 className="display">Publicidad</h1>
      </div>
      <p className="panel-hello">
        Publicidad del inicio y marcas nuevas: logo, look en la grilla y productos de esa marca. El admin también puede hacerlo.
      </p>
      <BrandsAdmin />
      <form
        className="form"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setError('')
          try {
            await api('/api/ads', {
              method: 'POST',
              body: {
                title: data.get('title'),
                image: image || data.get('image'),
                link: data.get('link'),
                scheduleMode,
                startsAt: data.get('startsAt') || null,
                endsAt: data.get('endsAt') || null,
              },
            })
            event.currentTarget.reset()
            setImage('')
            setScheduleMode('always')
            await load()
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <label>
          Título
          <input name="title" required />
        </label>
        <label>
          Imagen o video (URL)
          <input
            name="image"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            required
            placeholder="/uploads/..."
          />
        </label>
        {can('media') && (
          <label>
            Subir archivo
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,.gif,.webp"
              onChange={async (event) => {
                const files = [...event.target.files]
                event.target.value = ''
                if (!files.length) return
                setError('')
                try {
                  const data = await uploadFiles(files)
                  setImage(data.media[0]?.url || '')
                } catch (err) {
                  setError(err.message)
                }
              }}
            />
          </label>
        )}
        {image && (
          <div className="media-preview">
            <MediaFrame src={image} alt="" />
          </div>
        )}
        <label>
          Enlace
          <input name="link" defaultValue="/tienda" />
        </label>
        <label>
          Tiempo en pantalla
          <select value={scheduleMode} onChange={(event) => setScheduleMode(event.target.value)}>
            <option value="always">Siempre</option>
            <option value="until">Hasta que se acabe</option>
            <option value="range">Tiempo determinado</option>
          </select>
        </label>
        {scheduleMode === 'range' && (
          <label>
            Empieza
            <input name="startsAt" type="datetime-local" required />
          </label>
        )}
        {(scheduleMode === 'until' || scheduleMode === 'range') && (
          <label>
            Se acaba
            <input name="endsAt" type="datetime-local" required />
          </label>
        )}
        <button className="btn btn-lime" type="submit">
          Subir publicidad
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
      <div className="staff-table">
        {ads.map((ad) => (
          <article key={ad.id} className="staff-row">
            <div>
              <strong>{ad.title}</strong>
              <p>{scheduleLabel(ad)}</p>
              <div className="media-preview compact">
                <MediaFrame src={ad.image} alt="" />
              </div>
            </div>
            <div className="staff-controls">
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => api(`/api/ads/${ad.id}`, { method: 'PATCH', body: { active: !ad.active } }).then(load)}
              >
                {ad.active ? 'Ocultar' : 'Mostrar'}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => api(`/api/ads/${ad.id}`, { method: 'DELETE' }).then(load)}
              >
                Borrar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
