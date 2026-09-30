import { Link } from 'react-router-dom'
import { CATEGORY_RAIL } from '../data/shopNav'

export default function CategoryRail() {
  return (
    <div className="category-rail" aria-label="Categorías">
      {CATEGORY_RAIL.map((item) => (
        <Link key={item.to} className="category-chip" to={item.to}>
          {item.label}
        </Link>
      ))}
    </div>
  )
}
