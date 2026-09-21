import { useState } from 'react'
import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { IconBag, IconMenu, IconSearch, LogoMark } from './Icons'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const { count } = useCart()
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
      <div className="container header-inner">
        <button className="icon-btn menu-btn" type="button" aria-label="Menú" onClick={() => setOpen((v) => !v)}>
          <IconMenu open={open} />
        </button>

        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <LogoMark />
          <div className="logo-text">
            Almacén del Mono
            <span>moda contemporánea</span>
          </div>
        </Link>

        <nav className="nav" aria-label="Principal">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            type="button"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <IconSearch />
          </button>
          <Link className="icon-btn" to="/carrito" aria-label="Bolsa">
            <IconBag />
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form className="search-bar container" onSubmit={submitSearch}>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar prendas, tallas o categorías"
            aria-label="Buscar prendas"
          />
          <button className="btn btn-primary" type="submit">
            Buscar
          </button>
        </form>
      )}

      <nav className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
