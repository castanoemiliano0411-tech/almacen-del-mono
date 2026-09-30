import { isVideoSrc, mediaUrl } from '../data/media'

export default function MediaFrame({ src, alt = '', className = '' }) {
  const url = mediaUrl(src)
  if (!url) return null
  if (isVideoSrc(src) || isVideoSrc(url)) {
    return <video className={className} src={url} muted loop playsInline autoPlay />
  }
  return <img className={className} src={url} alt={alt} />
}
