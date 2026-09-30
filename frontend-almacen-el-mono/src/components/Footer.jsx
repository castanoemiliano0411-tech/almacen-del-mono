import { Link } from 'react-router-dom'
import { stores, WHATSAPP, whatsappLink } from '../data/stores'
import { useCatalog } from '../context/CatalogContext'

export default function Footer() {
  const { getBrands } = useCatalog()
  const brands = getBrands()
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="brand">
            <span className="brand-lead">El Almacén del</span> <span className="brand-mono">Mono</span>
          </p>
          <p>Streetwear de edición limitada. Drop 007 · Invierno 2025. Cada pieza, una sola vez.</p>
        </div>
        <div>
          <h3>Marcas</h3>
          {brands.map((brand) => (
            <Link key={brand} to={`/tienda?marca=${encodeURIComponent(brand)}`}>
              {brand}
            </Link>
          ))}
          <Link to="/tienda?vista=marcas">Ver todas</Link>
        </div>
        <div>
          <h3>Ayuda</h3>
          <Link to="/contacto">Contacto</Link>
          <Link to="/nosotros">La marca</Link>
          <Link to="/nosotros#envios">Envíos y cambios</Link>
          <a href="/#tiendas">Tiendas físicas</a>
        </div>
        <div>
          <h3>Locales</h3>
          {stores.map((store) => (
            <p key={store.id}>
              {store.city} · {store.address}
              <br />
              <a href={store.map} target="_blank" rel="noreferrer">
                Cómo llegar
              </a>
            </p>
          ))}
          <a href={whatsappLink('Hola, El Almacén del Mono')}>WhatsApp {WHATSAPP.display}</a>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} El Almacén del Mono · Drop 007</div>
    </footer>
  )
}
