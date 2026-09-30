import { useFavorites } from '../context/FavoritesContext'
import { IconHeart } from './Icons'

export default function FavButton({ id, className = '' }) {
  const { has, toggle } = useFavorites()
  const on = has(id)
  return (
    <button
      type="button"
      className={`fav-btn ${on ? 'is-on' : ''} ${className}`}
      aria-label={on ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(id)
      }}
    >
      <IconHeart filled={on} />
    </button>
  )
}
