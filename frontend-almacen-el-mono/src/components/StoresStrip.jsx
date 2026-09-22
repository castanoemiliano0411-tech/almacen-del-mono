import { stores, WHATSAPP, whatsappLink } from '../data/stores'

export default function StoresStrip() {
  return (
    <section className="stores-strip" id="tiendas">
      <div className="exclusives-head">
        <div>
          <p className="drop-label">Locales</p>
          <h2>
            Tiendas físicas.
            <em> Entrá, probá, llevate el drop.</em>
          </h2>
        </div>
        <a className="stores-wa" href={whatsappLink('Hola, quiero la ubicación de un local')}>
          WhatsApp {WHATSAPP.display}
        </a>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <article key={store.id} className="store-card">
            <p className="store-city">{store.city}</p>
            <h3>{store.name}</h3>
            <p className="store-address">{store.address}</p>
            <p className="store-hint">{store.hint}</p>
            <p className="store-meta">{store.transit}</p>
            <p className="store-meta">{store.hours}</p>
            <div className="store-actions">
              <a className="btn btn-lime" href={store.map} target="_blank" rel="noreferrer">
                Cómo llegar
              </a>
              <a
                className="btn btn-ghost"
                href={whatsappLink(`Hola, busco el local de ${store.city} · ${store.name}`)}
              >
                Pedir ubicación
              </a>
            </div>
          </article>
        ))}

        <article className="store-card store-card-wa">
          <p className="store-city">WhatsApp</p>
          <h3>Escribinos</h3>
          <p className="store-address">{WHATSAPP.display}</p>
          <p className="store-hint">
            Pedí talla, stock del drop o la pin de Google Maps. Respondemos en horario de tienda.
          </p>
          <p className="store-meta">Lun–sáb · 11:00 a 19:00</p>
          <div className="store-actions">
            <a className="btn btn-lime" href={whatsappLink('Hola, Almacén del Mono')}>
              Abrir WhatsApp
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
