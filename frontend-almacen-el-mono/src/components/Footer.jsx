import { Link } from 'react-router-dom'
import { stores, WHATSAPP, whatsappLink } from '../data/stores'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="brand">
            <span className="brand-lead">Almacén del</span> <span className="brand-mono">Mono</span>
          </p>
          <p>Streetwear de edición limitada. Drop 007 · Invierno 2025. Cada pieza, una sola vez.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/tienda?categoria=mujer">Mujer</Link>
          <Link to="/tienda?categoria=hombre">Hombre</Link>
          <Link to="/tienda?categoria=drops">Drops</Link>
          <Link to="/tienda?vista=marcas">Marcas</Link>
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
            </p>
          ))}
          <a href={whatsappLink('Hola, Almacén del Mono')}>WhatsApp {WHATSAPP.display}</a>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Almacén del Mono · Drop 007</div>
    </footer>
  )
}
