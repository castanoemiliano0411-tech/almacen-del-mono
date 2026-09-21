import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Hablemos</p>
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
            <textarea name="message" rows="5" required />
          </label>
          <button className="btn btn-accent" type="submit">
            Enviar
          </button>
          {sent && <p>Recibido. Te respondemos en menos de un día hábil.</p>}
        </form>
        <aside className="summary">
          <h2 className="display">Visítanos</h2>
          <p>Cra. 7 # 45-12, Bogotá</p>
          <p>Lun–Sáb · 11:00 a 19:00</p>
          <p>hola@almacendelmono.com</p>
        </aside>
      </div>
    </div>
  )
}
