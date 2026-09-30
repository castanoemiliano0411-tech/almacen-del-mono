import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import DropCountdown from '../components/DropCountdown'
import BrandTile from '../components/BrandTile'
import StoresStrip from '../components/StoresStrip'
import { api } from '../api'
import { useCatalog } from '../context/CatalogContext'
import { useAuth } from '../context/AuthContext'
import CategoryRail from '../components/CategoryRail'
import MediaFrame from '../components/MediaFrame'

export default function Home() {
  const { products, getBrands } = useCatalog()
  const { isStaff } = useAuth()
  const dropPieces = products.filter((item) => item.drop).slice(0, 6)
  const [ads, setAds] = useState([])

  useEffect(() => {
    const load = () =>
      api('/api/ads/public')
        .then((data) => setAds(data.ads || []))
        .catch(() => setAds([]))
    load()
    const timer = setInterval(load, isStaff ? 8000 : 30000)
    return () => clearInterval(timer)
  }, [isStaff])

  return (
    <>
      <section className="hero-drop">
        <img
          className="hero-drop-img"
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=2000&q=80"
          alt="Drop 007 — El Almacén del Mono"
        />
        <div className="hero-drop-shade" />
        <p className="hero-hotel">(HOTEL)</p>
        <div className="hero-drop-copy">
          <div className="drop-kicker">
            <span className="drop-badge">El Almacén del Mono — Drop 007</span>
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
            <a className="btn btn-lime" href="#marcas">
              Ver marcas →
            </a>
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

      <section className="home-mobile-intro">
        <h1>Almacén El Mono</h1>
        <p>Encuentra tu estilo en un solo lugar.</p>
        <CategoryRail />
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

      <section className="brand-strip" id="marcas">
        <div className="exclusives-head">
          <div>
            <p className="drop-label">Marcas</p>
            <h2>
              Elige marca.
              <em> Mujer y hombre están en el buscador.</em>
            </h2>
          </div>
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

      {dropPieces.length > 0 && (
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
      )}

      {ads.length > 0 && (
        <section className="ad-strip">
          {ads.map((ad) => (
            <Link key={ad.id} className="ad-card" to={ad.link || '/tienda'}>
              <MediaFrame src={ad.image} alt="" />
              <strong>{ad.title}</strong>
            </Link>
          ))}
        </section>
      )}

      <StoresStrip />
    </>
  )
}
