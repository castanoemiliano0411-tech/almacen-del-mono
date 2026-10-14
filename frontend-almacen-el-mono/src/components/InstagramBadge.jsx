import { INSTAGRAM } from '../data/stores'
import { IconInstagram } from './Icons'

export default function InstagramBadge({ size = 'md', showLabel = true, className = '' }) {
  return (
    <a
      className={`ig-badge ig-${size} ${className}`}
      href={INSTAGRAM.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir Instagram ${INSTAGRAM.handle}`}
    >
      <span className="ig-badge-mark">
        <IconInstagram size={size === 'lg' ? 42 : size === 'sm' ? 18 : 26} />
      </span>
      {showLabel && (
        <span className="ig-badge-copy">
          <b>Instagram</b>
          <small>{INSTAGRAM.handle}</small>
        </span>
      )}
    </a>
  )
}
