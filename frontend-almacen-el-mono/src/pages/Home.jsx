import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import DropCountdown from '../components/DropCountdown'
import { products, getBrands } from '../data/products'
import BrandTile from '../components/BrandTile'
import StoresStrip from '../components/StoresStrip'

export default function Home() {
  const dropPieces = products.filter((item) => item.drop).slice(0, 6)

  return (
    <>
      <section className="hero-drop">
        <img
          className="hero-drop-img"
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=2000&q=80"
          alt="Hoodie Hotel Drop 007"
        />
        <div className="hero-drop-shade" />
        <p className="hero-hotel">(HOTEL)</p>
        <div className="hero-drop-copy">
          <div className="drop-kicker">
            <span className="drop-badge">Almacén del Mono — Drop 007</span>
            <span className="drop-season">Colección Invierno 2025</span>
          </div>
          <h1 className="hero-title">
            Viste
            <br />
            <em>el</em>
            <br />
            vacío.
          </h1>
          <p className="hero-lead">
            Streetwear de edición limitada para los que no siguen tendencias — las crean. Cada pieza, una sola vez.
          </p>
        </div>

        <div className="hero-drop-bottom">
          <DropCountdown />
          <div className="hero-drop-actions">
            <Link className="btn btn-lime" to="/tienda?categoria=drops">
              Ver drops →
            </Link>
            <Link className="btn btn-ghost" to="/tienda">
              Explorar todo
            </Link>
          </div>
          <div className="scroll-hint">
            <span>Scroll</span>
            <i />
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div>
          <strong>Envío gratis</strong>
          <span>En compras +$150.000</span>
        </div>
        <div>
          <strong>Cambio sin costo</strong>
          <span>Si no te queda, lo cambiamos</span>
        </div>
        <div>
          <strong>Despacho 24-48h</strong>
          <span>Ciudades principales</span>
        </div>
        <div>
          <strong>Pago seguro</strong>
          <span>Tarjeta, PSE y contraentrega</span>
        </div>
      </section>

      <section className="brand-strip">
        <div className="exclusives-head">
          <div>
            <p className="drop-label">Marcas</p>
            <h2>
              Elige marca.
              <em> Puma, Nike, Adidas, Reebok, Under Armour.</em>
            </h2>
          </div>
          <Link to="/tienda?vista=marcas">Ver todas</Link>
        </div>
        <div className="brand-grid">
          {getBrands().map((brand, index) => (
            <BrandTile
              key={brand}
              brand={brand}
              index={index}
              to={`/tienda?marca=${encodeURIComponent(brand)}`}
            />
          ))}
        </div>
      </section>

      <section className="exclusives">
        <div className="exclusives-head">
          <div>
            <p className="drop-label">Drop 007</p>
            <h2>
              Exclusivos.
              <em> Por tiempo limitado.</em>
            </h2>
          </div>
          <p className="exclusives-aside">Cuando se agota, no vuelve.</p>
        </div>
        <div className="product-grid">
          {dropPieces.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <StoresStrip />
    </>
  )
}
