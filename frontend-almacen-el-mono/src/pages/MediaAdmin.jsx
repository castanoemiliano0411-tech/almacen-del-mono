import { useEffect, useState } from 'react'
import { api, uploadFiles } from '../api'
import MediaFrame from '../components/MediaFrame'

export default function MediaAdmin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = () => api('/api/media').then((data) => setItems(data.media || []))

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [])

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Medios</p>
        <h1 className="display">Fotos y videos</h1>
      </div>
      <p className="panel-hello">
        Subí imágenes (incluidos GIF animados) y videos. El administrador habilita este permiso a cada trabajador.
        Luego podés usar las URLs en productos y publicidad.
      </p>
      <form
        className="form"
        onSubmit={async (event) => {
          event.preventDefault()
          const files = [...event.currentTarget.files.files]
          setError('')
          setNotice('')
          if (!files.length) return
          try {
            await uploadFiles(files)
            event.currentTarget.reset()
            setNotice('Archivos subidos.')
            await load()
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <label>
          Archivos
          <input name="files" type="file" accept="image/*,video/mp4,video/webm,.gif,.webp" multiple required />
        </label>
        <button className="btn btn-lime" type="submit">
          Subir
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
      {notice && <p className="form-ok">{notice}</p>}
      <div className="media-grid">
        {items.map((item) => (
          <article key={item.id} className="media-card">
            <MediaFrame src={item.url} alt={item.originalName} />
            <p>
              {item.kind === 'video' ? 'Video' : 'Imagen'}
              {/\.gif$/i.test(item.originalName) ? ' animada' : ''}
            </p>
            <code>{item.url}</code>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={async () => {
                try {
                  await api(`/api/media/${item.id}`, { method: 'DELETE' })
                  await load()
                } catch (err) {
                  setError(err.message)
                }
              }}
            >
              Borrar
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
