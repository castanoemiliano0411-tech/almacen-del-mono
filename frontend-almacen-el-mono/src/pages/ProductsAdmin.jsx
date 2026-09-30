import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, uploadFiles } from '../api'
import ProductCard from '../components/ProductCard'
import ProductMediaPreview from '../components/ProductMediaPreview'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function splitMedia(value) {
  return String(value || '')
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function draftFromForm(form, presetBrand) {
  if (!form) {
    return {
      id: 'preview',
      name: '',
      brand: presetBrand,
      category: 'hombre',
      price: 0,
      stock: 4,
      sizes: ['M'],
      colors: ['Negro'],
      images: [],
      description: '',
      promo: '',
    }
  }
  const data = new FormData(form)
  return {
    id: 'preview',
    name: String(data.get('name') || ''),
    brand: String(data.get('brand') || presetBrand),
    category: String(data.get('category') || 'hombre'),
    price: Number(data.get('price') || 0),
    stock: Number(data.get('stock') || 0),
    sizes: splitList(data.get('sizes')).length ? splitList(data.get('sizes')) : ['M'],
    colors: splitList(data.get('colors')).length ? splitList(data.get('colors')) : ['Negro'],
    images: splitMedia(data.get('images')),
    description: String(data.get('description') || ''),
    promo: String(data.get('promo') || ''),
    featured: false,
    drop: false,
  }
}

export default function ProductsAdmin() {
  const { can, user } = useAuth()
  const { refresh, getBrands } = useCatalog()
  const [params] = useSearchParams()
  const presetBrand = params.get('marca') || ''
  const formRef = useRef(null)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState(() => draftFromForm(null, presetBrand))
  const [localMedia, setLocalMedia] = useState([])

  const bumpDraft = () => setDraft(draftFromForm(formRef.current, presetBrand))

  useEffect(() => {
    bumpDraft()
  }, [presetBrand])

  const load = () => api('/api/products').then((data) => setProducts(data.products))

  const patch = async (id, body) => {
    setError('')
    try {
      const data = await api(`/api/products/${id}`, { method: 'PATCH', body })
      setProducts((list) => list.map((item) => (item.id === id ? data.product : item)))
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [])

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Staff</p>
        <h1 className="display">{can('products') ? 'Productos' : 'Marcas'}</h1>
      </div>
      {can('products') && (
        <div className="publish-layout">
        <form
          className="form"
          key={presetBrand}
          ref={formRef}
          onInput={bumpDraft}
          onSubmit={async (event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            setError('')
            setNotice('')
            try {
              await api('/api/products', {
                method: 'POST',
                body: {
                  name: data.get('name'),
                  brand: data.get('brand'),
                  category: data.get('category'),
                  price: Number(data.get('price')),
                  stock: Number(data.get('stock')),
                  sizes: data.get('sizes'),
                  colors: data.get('colors'),
                  images: data.get('images'),
                  description: data.get('description'),
                  promo: data.get('promo') || null,
                },
              })
              event.currentTarget.reset()
              setDraft(draftFromForm(null, presetBrand))
              setNotice('Producto publicado. Ya lo ven los clientes.')
              await load()
              await refresh()
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
            Marca
            <input name="brand" required defaultValue={presetBrand} list="brand-list" placeholder="Nike o una marca nueva" />
            <datalist id="brand-list">
              {getBrands().map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </label>
          <label>
            Categoría
            <select name="category" defaultValue="hombre">
              <option value="mujer">Mujer</option>
              <option value="hombre">Hombre</option>
              <option value="outfits">Outfits</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </label>
          <label>
            Precio COP
            <input name="price" type="number" min="1000" required />
          </label>
          <label>
            Cantidad
            <input name="stock" type="number" min="0" defaultValue="4" />
          </label>
          <label>
            Tallas (separadas por coma)
            <input name="sizes" placeholder="S, M, L" />
          </label>
          <label>
            Colores
            <input name="colors" placeholder="Negro, Blanco" />
          </label>
          <label>
            Fotos o videos (una URL por línea)
            <textarea name="images" rows="3" placeholder="https://… o /uploads/archivo.mp4" />
          </label>
          {can('media') && (
            <label>
              Subir foto o video
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,.gif,.webp"
                multiple
                onChange={async (event) => {
                  const files = [...event.target.files]
                  event.target.value = ''
                  if (!files.length) return
                  setError('')
                  let blobs = []
                  try {
                    blobs = files.map((file) => {
                      const url = URL.createObjectURL(file)
                      return file.type.startsWith('video/') ? `${url}#.mp4` : `${url}#.jpg`
                    })
                    setLocalMedia(blobs)
                    const data = await uploadFiles(files)
                    blobs.forEach((src) => URL.revokeObjectURL(src.split('#')[0]))
                    setLocalMedia([])
                    const box = formRef.current?.elements.images
                    const extra = data.media.map((item) => item.url).join('\n')
                    if (box) box.value = [box.value, extra].filter(Boolean).join('\n')
                    bumpDraft()
                    setNotice('Archivo listo. Mirá la vista previa a la derecha antes de publicar.')
                  } catch (err) {
                    blobs.forEach((src) => URL.revokeObjectURL(String(src).split('#')[0]))
                    setLocalMedia([])
                    setError(err.message)
                  }
                }}
              />
            </label>
          )}
          <label>
            Descripción
            <textarea name="description" rows="3" />
          </label>
          <label>
            Promoción
            <input name="promo" placeholder="sale" />
          </label>
          <button className="btn btn-lime" type="submit">
            Publicar en el sitio
          </button>
        </form>
        <aside className="publish-preview">
          <h2 className="filter-title">Cómo se ve</h2>
          <p className="guide-line">Nadie más lo ve hasta que publiques. Pasá el mouse sobre la tarjeta: si hay dos fotos, cambia como en la tienda.</p>
          <ProductMediaPreview urls={[...localMedia, ...draft.images]} />
          <div className="publish-card-wrap">
            <ProductCard product={{ ...draft, images: [...localMedia, ...draft.images] }} preview />
          </div>
        </aside>
        </div>
      )}
      {user?.role === 'admin' && (
        <form
          className="form"
          onSubmit={async (event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            setError('')
            try {
              await api('/api/categories', { method: 'POST', body: { name: data.get('catName') } })
              event.currentTarget.reset()
              setNotice('Categoría guardada.')
            } catch (err) {
              setError(err.message)
            }
          }}
        >
          <h2 className="filter-title">Categoría</h2>
          <label>
            Nombre
            <input name="catName" required />
          </label>
          <button className="btn btn-ghost" type="submit">
            Crear o actualizar categoría
          </button>
        </form>
      )}
      {error && <p className="form-error">{error}</p>}
      {notice && <p className="form-ok">{notice}</p>}
      <div className="staff-table">
        {products.map((product) => (
          <article key={product.id} className="staff-row">
            <div>
              <strong>{product.name}</strong>
              <p>
                {product.brand} · {product.category} · {product.stock} u.
              </p>
            </div>
            <div className="staff-controls">
              {can('products') && (
                <label>
                  Nombre
                  <input
                    defaultValue={product.name}
                    onBlur={(event) => {
                      const name = event.target.value.trim()
                      if (name && name !== product.name) patch(product.id, { name })
                    }}
                  />
                </label>
              )}
              {(can('brands') || can('products')) && (
                <label>
                  Marca
                  <input
                    defaultValue={product.brand}
                    onBlur={(event) => {
                      const brand = event.target.value.trim()
                      if (brand && brand !== product.brand) patch(product.id, { brand })
                    }}
                  />
                </label>
              )}
              {can('products') && (
                <label>
                  Precio COP
                  <input
                    type="number"
                    min="1000"
                    defaultValue={product.price}
                    onBlur={(event) => {
                      const price = Number(event.target.value)
                      if (price && price !== product.price) patch(product.id, { price })
                    }}
                  />
                </label>
              )}
              {can('sizes') && (
                <label>
                  Tallajes
                  <input
                    defaultValue={(product.sizes || []).join(', ')}
                    onBlur={(event) => {
                      const sizes = event.target.value
                      if (sizes !== (product.sizes || []).join(', ')) patch(product.id, { sizes })
                    }}
                  />
                </label>
              )}
              {can('products') && (
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`¿Eliminar ${product.name}?`)) return
                    setError('')
                    try {
                      await api(`/api/products/${product.id}`, { method: 'DELETE' })
                      setProducts((list) => list.filter((item) => item.id !== product.id))
                      await refresh()
                    } catch (err) {
                      setError(err.message)
                    }
                  }}
                >
                  Eliminar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
