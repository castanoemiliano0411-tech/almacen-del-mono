import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categories, products } from '../data/products'

export default function Home() {
  const featured = products.filter((item) => item.featured)

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Colección otoño</p>
          <h1 className="display">Viste con carácter, no con ruido.</h1>
          <p>Prendas, precios y tallas claros. Un almacén de moda contemporánea para el día a día.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/tienda">
              Comprar ahora
            </Link>
            <Link className="btn btn-ghost" to="/tienda?categoria=novedades">
              Ver novedades
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <strong>8</strong>
              looks destacados
            </div>
            <div>
              <strong>30 días</strong>
              para cambios
            </div>
            <div>
              <strong>-21%</strong>
              en promociones
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1469334031216-e382a71b716b?auto=format&fit=crop&w=1400&q=80"
            alt="Editorial de moda Almacén del Mono"
          />
          <div className="hero-chip">
            <p className="eyebrow">Look de la semana</p>
            <strong>Lino, sastrería y cuero vegetal</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Explorar</p>
              <h2 className="display">Compra por categoría</h2>
            </div>
          </div>
          <div className="categories">
            {categories.map((category) => (
              <Link key={category.id} to={`/tienda?categoria=${category.id}`} className="category-card">
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Selección</p>
              <h2 className="display">Piezas destacadas</h2>
            </div>
            <Link to="/tienda">Ver todo</Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="editorial">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80"
          alt="Interior de tienda"
        />
        <div className="editorial-copy">
          <p className="eyebrow">El almacén</p>
          <h2 className="display">Hecho para verse bien y usarse mucho.</h2>
          <p>
            Elegimos telas con caída honesta y cortes que no pasan de moda en una temporada. Menos stock, más criterio.
          </p>
          <Link className="btn btn-ghost" to="/nosotros" style={{ color: '#f6f1ea', borderColor: '#f6f1ea', width: 'fit-content' }}>
            Nuestra historia
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container promo-strip">
          <article className="promo-item">
            <p className="eyebrow">Envíos</p>
            <h3 className="display">Gratis desde $200.000</h3>
            <p>Entregas en ciudades principales en 2 a 4 días hábiles.</p>
          </article>
          <article className="promo-item">
            <p className="eyebrow">Tallas</p>
            <h3 className="display">Guía clara</h3>
            <p>Cada prenda indica tallas reales. Si no calza, la cambias.</p>
          </article>
          <article className="promo-item">
            <p className="eyebrow">Promos</p>
            <h3 className="display">Hasta -21%</h3>
            <p>Descuentos visibles en ficha. Sin letras pequeñas de último minuto.</p>
          </article>
        </div>
      </section>
    </>
  )
}
