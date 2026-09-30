import { useRef, useState } from 'react'
import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { categories } from '../data/products'
import { IconBag, IconMenu, IconSearch } from './Icons'

const SEARCH_CATEGORIES = [...categories, { id: 'sale', name: 'Sale' }]

const CATEGORY_QUERY = {
  mujer: 'mujer',
  dama: 'mujer',
  damas: 'mujer',
  hombre: 'hombre',
  caballero: 'hombre',
  accesorios: 'accesorios',
  outfits: 'outfits',
  drops: 'drops',
  drop: 'drops',
  sale: 'sale',
}

export default function Header() {
  const { count, openCart } = useCart()
  const { user } = useAuth()
  const { getBrands } = useCatalog()
  const brands = getBrands()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const navigate = useNavigate()
  const taps = useRef({ count: 0, at: 0 })

  const goShop = (search) => {
    navigate(search ? `/tienda?${search}` : '/tienda')
    setSearchOpen(false)
    setOpen(false)
  }

  const toggleLine = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'sale') {
      if (next.get('sale') === '1' || next.getAll('categoria').includes('sale')) {
        next.delete('sale')
        const cats = next.getAll('categoria').filter((item) => item !== 'sale')
        next.delete('categoria')
        cats.forEach((item) => next.append('categoria', item))
      } else {
        next.set('sale', '1')
      }
    } else {
      const values = next.getAll('categoria').filter((item) => item !== 'sale')
      next.delete('categoria')
      const has = values.includes(id)
      const updated = has ? values.filter((item) => item !== id) : [...values, id]
      updated.forEach((item) => next.append('categoria', item))
    }
    navigate(`/tienda?${next.toString()}`)
    setOpen(false)
  }

  const submitSearch = (event) => {
    event.preventDefault()
    const next = query.trim()
    if (!next) {
      goShop('')
      return
    }
    const mapped = CATEGORY_QUERY[next.toLowerCase()]
    if (mapped) {
      goShop(`categoria=${encodeURIComponent(mapped)}`)
      return
    }
    goShop(`q=${encodeURIComponent(next)}`)
  }

  return (
    <header className="header">
      <div className="header-inner">
        <button className="icon-btn menu-btn" type="button" aria-label="Menú" onClick={() => setOpen((v) => !v)}>
          <IconMenu open={open} />
        </button>

        <Link
          to="/"
          className="brand"
          onClick={(event) => {
            setOpen(false)
            const now = Date.now()
            if (now - taps.current.at > 1600) taps.current.count = 0
            taps.current.at = now
            taps.current.count += 1
            if (taps.current.count >= 5) {
              event.preventDefault()
              taps.current.count = 0
              window.dispatchEvent(new Event('mono-staff-gate'))
            }
          }}
        >
          <span className="brand-lead">El Almacén del</span>
          <span className="brand-mono">Mono</span>
        </Link>

        <nav className="nav" aria-label="Marcas">
          {brands.map((brand) => (
            <Link key={brand} to={`/tienda?marca=${encodeURIComponent(brand)}`}>
              {brand}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {user?.role === 'client' ? (
            <NavLink className="account-link" to="/cuenta">
              Cuenta
            </NavLink>
          ) : user?.role === 'admin' || user?.role === 'worker' ? (
            <NavLink className="account-link" to="/admin/inicio">
              Operaciones
            </NavLink>
          ) : (
            <NavLink className="account-link" to="/entrar">
              Entrar
            </NavLink>
          )}
          <button className="icon-btn" type="button" aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
            <IconSearch />
          </button>
          <button className="icon-btn cart-trigger" type="button" aria-label="Carrito" onClick={openCart}>
            <IconBag />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-panel">
          <form className="search-bar" onSubmit={submitSearch}>
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscá mujer, hombre, una marca o un producto…"
              aria-label="Buscar prendas"
            />
            <button className="btn btn-lime" type="submit">
              Buscar
            </button>
          </form>
          <div className="search-chips" aria-label="Filtrar por línea">
            {SEARCH_CATEGORIES.map((item) => {
              const on =
                item.id === 'sale'
                  ? params.get('sale') === '1' || params.getAll('categoria').includes('sale')
                  : params.getAll('categoria').includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`search-chip ${on ? 'is-on' : ''}`}
                  onClick={() => toggleLine(item.id)}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <nav className={`mobile-nav ${open ? 'open' : ''}`}>
        {brands.map((brand) => (
          <Link key={brand} to={`/tienda?marca=${encodeURIComponent(brand)}`} onClick={() => setOpen(false)}>
            {brand}
          </Link>
        ))}
        <NavLink to="/nosotros" onClick={() => setOpen(false)}>
          Nosotros
        </NavLink>
        <NavLink to="/contacto" onClick={() => setOpen(false)}>
          Contacto
        </NavLink>
        {user?.role === 'client' ? (
          <NavLink to="/cuenta" onClick={() => setOpen(false)}>
            Cuenta
          </NavLink>
        ) : user?.role === 'admin' || user?.role === 'worker' ? (
          <>
            <NavLink to="/admin/inicio" onClick={() => setOpen(false)}>
              Operaciones
            </NavLink>
            <NavLink to="/tienda?vista=marcas" onClick={() => setOpen(false)}>
              Ver tienda
            </NavLink>
          </>
        ) : (
          <NavLink to="/entrar" onClick={() => setOpen(false)}>
            Entrar
          </NavLink>
        )}
      </nav>
    </header>
  )
}
