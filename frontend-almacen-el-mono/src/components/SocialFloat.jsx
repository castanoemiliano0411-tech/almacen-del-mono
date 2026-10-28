import InstagramBadge from './InstagramBadge'
import WhatsAppBadge from './WhatsAppBadge'

export default function SocialFloat() {
  return (
    <div className="social-float" aria-label="Redes sociales">
      <WhatsAppBadge size="sm" showLabel={false} className="social-float-btn" />
      <InstagramBadge size="sm" showLabel={false} className="social-float-btn" />
    </div>
  )
}
