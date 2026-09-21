import { Link } from 'react-router-dom'
import { LogoMark } from './Icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">
            <LogoMark />
            <div className="logo-text">Almacén del Mono</div>
          </div>
          <p>Prendas pensadas para durar. Cortes limpios, telas honestas y una experiencia de compra sencilla.</p>
        </div>
        <div>
          <h3>Tienda</h3>
          <Link to="/tienda?categoria=mujer">Mujer</Link>
          <Link to="/tienda?categoria=hombre">Hombre</Link>
          <Link to="/tienda?categoria=accesorios">Accesorios</Link>
          <Link to="/tienda?categoria=novedades">Novedades</Link>
        </div>
        <div>
          <h3>Ayuda</h3>
          <Link to="/contacto">Contacto</Link>
          <Link to="/nosotros">Nuestra historia</Link>
          <Link to="/nosotros#envios">Envíos y cambios</Link>
        </div>
        <div>
          <h3>Novedades</h3>
          <p>Recibe lanzamientos y promociones.</p>
          <form
            className="newsletter"
            onSubmit={(event) => {
              event.preventDefault()
              event.currentTarget.reset()
            }}
          >
            <input type="email" placeholder="Tu correo" required aria-label="Correo" />
            <button type="submit">Unirme</button>
          </form>
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} Almacén del Mono. Todos los derechos reservados.</div>
    </footer>
  )
}
