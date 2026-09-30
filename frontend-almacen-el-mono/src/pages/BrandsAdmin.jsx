import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, uploadFiles } from '../api'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { mediaUrl } from '../data/media'

export default function BrandsAdmin() {
  const { can } = useAuth()
  const { brands, refreshBrands } = useCatalog()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [logo, setLogo] = useState('')

  const load = () => refreshBrands()

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [])

  if (!can('ads') && !can('brands')) return null

  return (
    <section className="brand-studio">
      <h2 className="filter-title">Marcas en vivo</h2>
      <p className="guide-line">
        Creá una marca con nombre y logo. En cuanto la guardás aparece en Inicio y Tienda. Después subí productos de esa marca.
      </p>
      <form
        className="form"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setError('')
          setNotice('')
          try {
            const created = await api('/api/brands', {
              method: 'POST',
              body: {
                name: data.get('name'),
                image: logo || data.get('image'),
              },
            })
            event.currentTarget.reset()
            setLogo('')
            await load()
            setNotice(`Listo: ${created.brand.name} ya está en la tienda. Ahora subí productos.`)
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <label>
          Nombre de la marca
          <input name="name" required minLength={2} placeholder="Ej: New Balance" />
        </label>
        <label>
          Logo o imagen (URL)
          <input
            name="image"
            value={logo}
            onChange={(event) => setLogo(event.target.value)}
            placeholder="/uploads/logo.webp"
          />
        </label>
        {(can('media') || can('ads')) && (
          <label>
            Subir logo
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const files = [...event.target.files]
                event.target.value = ''
                if (!files.length) return
                try {
                  const data = await uploadFiles(files)
                  setLogo(data.media[0]?.url || '')
                  setNotice('Logo listo. Guardá la marca.')
                } catch (err) {
                  setError(err.message)
                }
              }}
            />
          </label>
        )}
        {logo && <img className="brand-preview" src={mediaUrl(logo)} alt="" />}
        <button className="btn btn-lime" type="submit">
          Crear marca y mostrar en el sitio
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
      {notice && <p className="form-ok">{notice}</p>}
      <div className="recent-grid">
        {brands.map((brand) => (
          <article key={brand.id || brand.name} className="recent-card">
            {brand.image ? (
              <img className="brand-preview" src={mediaUrl(brand.image)} alt="" />
            ) : (
              <span className="history-avatar">{brand.name.slice(0, 1)}</span>
            )}
            <strong>{brand.name}</strong>
            <p>Visible en tienda</p>
            <Link className="btn btn-ghost" to={`/admin/productos?marca=${encodeURIComponent(brand.name)}`}>
              Subir productos de {brand.name}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
