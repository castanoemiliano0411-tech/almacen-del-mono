import { WHATSAPP, whatsappLink } from '../data/stores'
import { IconWhatsApp } from './Icons'

export default function WhatsAppBadge({
  size = 'md',
  showLabel = true,
  className = '',
  message = 'Hola, El Almacén del Mono',
}) {
  return (
    <a
      className={`ig-badge wa-badge ig-${size} ${className}`}
      href={whatsappLink(message)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir WhatsApp ${WHATSAPP.display}`}
    >
      <span className="ig-badge-mark">
        <IconWhatsApp size={size === 'lg' ? 42 : size === 'sm' ? 18 : 26} />
      </span>
      {showLabel && (
        <span className="ig-badge-copy">
          <b>WhatsApp</b>
          <small>{WHATSAPP.display}</small>
        </span>
      )}
    </a>
  )
}
