import { useState } from 'react'
import { stores, WHATSAPP, whatsappLink } from '../data/stores'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Drop 007</p>
        <h1 className="display">Contacto</h1>
      </div>
      <div className="contact-layout">
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
            event.currentTarget.reset()
          }}
        >
          <label>
            Nombre
            <input name="name" required />
          </label>
          <label>
            Correo
            <input type="email" name="email" required />
          </label>
          <label>
            Mensaje
            <textarea name="message" rows="5" required placeholder="Talla, drop o si quieres aviso del 008" />
          </label>
          <button className="btn btn-lime" type="submit">
            Enviar
          </button>
          {sent && <p>Listo. Te escribimos antes del siguiente drop.</p>}
        </form>
        <aside className="summary">
          <h2 className="display">Locales</h2>
          {stores.map((store) => (
            <div key={store.id} style={{ marginBottom: 18 }}>
              <p>
                <strong>
                  {store.city} · {store.name}
                </strong>
              </p>
              <p>{store.municipality}</p>
              <p>{store.address}</p>
              {(store.hoursLines || [store.hours]).map((line) => (
                <p key={line}>{line}</p>
              ))}
              {store.photo ? (
                <a className="store-map is-contact" href={store.map} target="_blank" rel="noreferrer">
                  <img src={store.photo} alt={`Mapa del local en ${store.city}`} />
                  <span>Cómo llegar en Google Maps</span>
                </a>
              ) : (
                <a href={store.map} target="_blank" rel="noreferrer">
                  Cómo llegar
                </a>
              )}
            </div>
          ))}
          <p>hola@almacendelmono.com</p>
          <a className="btn btn-lime" href={whatsappLink('Hola, El Almacén del Mono')} style={{ marginTop: 16 }}>
            WhatsApp {WHATSAPP.display}
          </a>
        </aside>
      </div>
    </div>
  )
}
