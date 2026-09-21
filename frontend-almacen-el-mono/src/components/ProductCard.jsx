import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'

export default function ProductCard({ product }) {
  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-thumb">
        <img src={product.images[0]} alt={product.name} />
        {product.isNew && <span className="tag">Nuevo</span>}
        {product.promo && <span className="tag sale">{product.promo}</span>}
      </div>
      <h3>{product.name}</h3>
      <div className="price">
        <span>{formatPrice(product.price)}</span>
        {product.compareAt && <span className="compare">{formatPrice(product.compareAt)}</span>}
      </div>
    </Link>
  )
}
