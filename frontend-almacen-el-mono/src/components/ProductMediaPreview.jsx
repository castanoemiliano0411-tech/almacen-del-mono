import { useEffect, useState } from 'react'
import { isVideoSrc, mediaUrl } from '../data/media'
import MediaFrame from './MediaFrame'

export default function ProductMediaPreview({ urls }) {
  const list = (urls || []).filter(Boolean)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [list.join('\n')])
  const current = list[Math.min(active, Math.max(list.length - 1, 0))]
  const url = mediaUrl(current)

  if (!list.length) {
    return (
      <div className="media-preview-stage is-empty">
        <p>Subí una foto o un video para verlo acá, a tamaño real, antes de publicar.</p>
      </div>
    )
  }

  return (
    <div className="media-preview-stage">
      <div className="media-preview-main">
        {isVideoSrc(current) || isVideoSrc(url) ? (
          <video key={url} src={url} controls playsInline autoPlay muted={false} />
        ) : (
          <img src={url} alt="Vista previa del producto" />
        )}
        <p className="guide-line">
          {isVideoSrc(current) || isVideoSrc(url)
            ? 'Reproducí el video con el control. Así lo van a ver los clientes en la ficha.'
            : 'Esta es la foto principal. Si hay una segunda, en la tarjeta cambia al pasar el mouse.'}
        </p>
      </div>
      {list.length > 1 && (
        <div className="media-preview-thumbs">
          {list.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className={index === active ? 'is-on' : ''}
              onClick={() => setActive(index)}
            >
              <MediaFrame src={src} alt="" />
              <span>{isVideoSrc(src) ? 'Video' : `Foto ${index + 1}`}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
