import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useFavorites } from '../context/FavoritesContext'
import { CLIENT_MENU } from '../data/shopNav'
import { IconBag, IconHeart, IconMenu, IconSearch } from './Icons'

const CATEGORY_QUERY = {
  mujer: 'mujer',
  dama: 'mujer',
  hombre: 'hombre',
  caballero: 'hombre',
  accesorios: 'tipo=accesorios',
  calzado: 'tipo=calzado',
  ropa: 'tipo=ropa',
  gorras: 'tipo=gorras',
  relojes: 'tipo=relojes',
  ofertas: 'sale=1',
  sale: 'sale=1',
}

export default function Header() {
  const { count, openCart } = useCart()
  const { count: favCount } = useFavorites()
  const { user } = useAuth()
  const { getBrands } = useCatalog()
  const brands = getBrands()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const navigate = useNavigate()
  const taps = useRef({ count: 0, at: 0 })

  useEffect(() => {
    document.body.classList.toggle('nav-lock', open)
    return () => document.body.classList.remove('nav-lock')
  }, [open])

  const close = () => setOpen(false)

  const goShop = (search) => {
    navigate(search ? `/tienda?${search}` : '/tienda')
    setSearchOpen(false)
    close()
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
      goShop(mapped.includes('=') ? mapped : `categoria=${mapped}`)
      return
    }
    goShop(`q=${encodeURIComponent(next)}`)
  }

  const menuItem = (item) => {
    if (item.cart) {
      return (
        <button
          key={item.label}
          type="button"
          className="mobile-drawer-link"
          onClick={() => {
            close()
            openCart()
          }}
        >
          {item.label}
        </button>
      )
    }
    return (
      <Link key={item.to} to={item.to} className="mobile-drawer-link" onClick={close}>
        {item.label}
      </Link>
    )
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link
          to="/"
          className="brand"
          onClick={(event) => {
            close()
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
          <span className="brand-lockup">
            <span className="brand-line1">El Almacén</span>
            <span className="brand-line2">
              del <span className="brand-mono">Mono</span>
            </span>
          </span>
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
            <NavLink className="account-link desktop-only" to="/cuenta">
              Cuenta
            </NavLink>
          ) : user?.role === 'admin' || user?.role === 'worker' ? (
            <NavLink className="account-link desktop-only" to="/admin/inicio">
              Operaciones
            </NavLink>
          ) : (
            <NavLink className="account-link desktop-only" to="/entrar">
              Entrar
            </NavLink>
          )}
          <button className="icon-btn" type="button" aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
            <IconSearch />
          </button>
          <Link className="icon-btn fav-header" to="/favoritos" aria-label="Favoritos">
            <IconHeart filled={favCount > 0} />
            {favCount > 0 && <span className="badge">{favCount}</span>}
          </Link>
          <button className="icon-btn cart-trigger" type="button" aria-label="Carrito" onClick={openCart}>
            <IconBag />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
          <button className="icon-btn menu-btn" type="button" aria-label="Menú" onClick={() => setOpen((v) => !v)}>
            <IconMenu open={open} />
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
              placeholder="Buscar por nombre, marca o categoría"
              aria-label="Buscar productos"
            />
            <button className="btn btn-lime" type="submit">
              Buscar
            </button>
          </form>
        </div>
      )}

      {open && <button type="button" className="nav-backdrop" aria-label="Cerrar menú" onClick={close} />}
      <nav className={`mobile-drawer ${open ? 'open' : ''}`} aria-label="Menú">
        <p className="mobile-drawer-title">Almacén El Mono</p>
        {CLIENT_MENU.map(menuItem)}
        {user?.role === 'client' ? (
          <NavLink to="/cuenta" className="mobile-drawer-link" onClick={close}>
            Mi cuenta
          </NavLink>
        ) : (
          <>
            <NavLink to="/entrar" className="mobile-drawer-link" onClick={close}>
              Iniciar sesión
            </NavLink>
            <NavLink to="/registro" className="mobile-drawer-link" onClick={close}>
              Crear cuenta
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
