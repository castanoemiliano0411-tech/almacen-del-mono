import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useFavorites } from '../context/FavoritesContext'
import { useCatalog } from '../context/CatalogContext'

export default function Favorites() {
  const { ids } = useFavorites()
  const { products } = useCatalog()
  const list = ids.map((id) => products.find((item) => item.id === id)).filter(Boolean)

  return (
    <div className="container fav-page">
      <div className="store-intro is-page">
        <h1>♡ Mis favoritos</h1>
        <p>Guardados para ver después. No es el carrito.</p>
      </div>
      {list.length === 0 ? (
        <div className="empty">
          <p>Todavía no guardaste piezas.</p>
          <Link className="btn btn-lime" to="/tienda">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="product-grid shop-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
