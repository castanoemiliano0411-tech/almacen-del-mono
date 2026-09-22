import { useState } from 'react'
import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { IconBag, IconMenu, IconSearch } from './Icons'

const links = [
  { to: '/tienda?categoria=mujer', label: 'Mujer' },
  { to: '/tienda?categoria=hombre', label: 'Hombre' },
  { to: '/tienda?vista=marcas', label: 'Marcas' },
  { to: '/tienda?categoria=drops', label: 'Drops' },
  { to: '/tienda?categoria=sale', label: 'Sale', accent: true },
]

export default function Header() {
  const { count, openCart } = useCart()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const navigate = useNavigate()

  const submitSearch = (event) => {
    event.preventDefault()
    const next = query.trim()
    navigate(next ? `/tienda?q=${encodeURIComponent(next)}` : '/tienda')
    setSearchOpen(false)
    setOpen(false)
  }

  return (
    <header className="header">
      <div className="header-inner">
        <button className="icon-btn menu-btn" type="button" aria-label="Menú" onClick={() => setOpen((v) => !v)}>
          <IconMenu open={open} />
        </button>

        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-lead">Almacén del</span>
          <span className="brand-mono">Mono</span>
        </Link>

        <nav className="nav" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${link.accent ? 'nav-sale' : ''} ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
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
        <form className="search-bar" onSubmit={submitSearch}>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar drops, prendas, tallas…"
            aria-label="Buscar prendas"
          />
          <button className="btn btn-lime" type="submit">
            Buscar
          </button>
        </form>
      )}

      <nav className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={link.accent ? 'nav-sale' : ''} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/nosotros" onClick={() => setOpen(false)}>
          Nosotros
        </NavLink>
        <NavLink to="/contacto" onClick={() => setOpen(false)}>
          Contacto
        </NavLink>
      </nav>
    </header>
  )
}
