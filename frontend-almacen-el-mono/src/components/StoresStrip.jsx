import { INSTAGRAM, stores, whatsappLink } from '../data/stores'
import InstagramBadge from './InstagramBadge'
import WhatsAppBadge from './WhatsAppBadge'

function StoreMap({ store }) {
  if (!store.photo || !store.map) return null
  return (
    <a className="store-map" href={store.map} target="_blank" rel="noreferrer">
      <img src={store.photo} alt={`Cómo llegar a ${store.city}, ${store.address}`} />
      <span>Abrir en Google Maps</span>
    </a>
  )
}

function Hours({ store }) {
  return (
    <div className="store-hours">
      {(store.hoursLines || [store.hours]).map((line) => (
        <p key={line} className="store-meta">
          {line}
        </p>
      ))}
    </div>
  )
}

export default function StoresStrip() {
  return (
    <section className="stores-strip" id="tiendas">
      <div className="exclusives-head">
        <div>
          <p className="drop-label">Locales</p>
          <h2>
            Cómo llegar.
            <em> La Ceja y Rionegro.</em>
          </h2>
        </div>
        <div className="stores-links">
          <WhatsAppBadge size="md" />
          <InstagramBadge size="md" className="ig-in-stores" />
        </div>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <article key={store.id} className="store-card">
            <p className="store-city">{store.municipality}</p>
            <h3>{store.city}</h3>
            <p className="store-address">{store.address}</p>
            <p className="store-hint">{store.hint}</p>
            <p className="store-meta">{store.transit}</p>
            <Hours store={store} />
            <StoreMap store={store} />
            <div className="store-actions">
              {store.map && (
                <a className="btn btn-lime" href={store.map} target="_blank" rel="noreferrer">
                  Cómo llegar
                </a>
              )}
              <WhatsAppBadge size="sm" message={`Hola, busco el local de ${store.city}`} />
            </div>
          </article>
        ))}

        <article className="store-card store-card-wa">
          <p className="store-city">WhatsApp</p>
          <h3>Escribinos</h3>
          <WhatsAppBadge size="lg" />
          <p className="store-hint">Tocá el logo verde y se abre el chat. Pedí talla, stock o cómo llegar.</p>
          <p className="store-meta">La Ceja y Rionegro · horarios de cada local</p>
          <div className="store-actions">
            <a className="btn btn-lime" href={whatsappLink('Hola, El Almacén del Mono')}>
              Abrir WhatsApp
            </a>
          </div>
        </article>

        <article className="store-card store-card-ig">
          <p className="store-city">Instagram</p>
          <h3>Mirá el local</h3>
          <InstagramBadge size="lg" />
          <p className="store-hint">Fotos, drops y el día a día. Tocá el logo y se abre el perfil.</p>
          <p className="store-meta">La Ceja y Rionegro · misma info que acá</p>
          <div className="store-actions">
            <a className="btn btn-lime" href={INSTAGRAM.url} target="_blank" rel="noreferrer">
              Abrir Instagram
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
