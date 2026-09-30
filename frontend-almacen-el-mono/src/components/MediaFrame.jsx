import { isVideoSrc, mediaUrl } from '../data/media'

export default function MediaFrame({ src, alt = '', className = '', style }) {
  const url = mediaUrl(src)
  if (!url) return null
  if (isVideoSrc(src) || isVideoSrc(url)) {
    return <video className={className} src={url} muted loop playsInline autoPlay style={style} />
  }
  return <img className={className} src={url} alt={alt} style={style} />
}
