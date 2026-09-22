export default function About() {
  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Drop culture</p>
        <h1 className="display">
          Viste <em>el</em> vacío.
        </h1>
      </div>
      <div className="about-layout">
        <div>
          <p style={{ fontSize: '1.12rem', marginBottom: 18 }}>
            Almacén del Mono hace streetwear en corridas cortas. No hay restock: si el Drop 007 se agota, esa pieza no
            vuelve. Por eso el countdown, el -30% real y el “cuando se acaba, no vuelve”.
          </p>
          <p style={{ color: 'var(--muted)' }}>
            Diseñamos en Bogotá. Cada drop sale un jueves a mediodía, con un cupo por talla. El Sale es lo que queda
            de drops anteriores, no un truco de temporada.
          </p>
          <div id="envios" style={{ marginTop: 28 }}>
            <p className="eyebrow">Envíos y cambios</p>
            <h2 className="display" style={{ fontSize: '2rem', margin: '8px 0 12px' }}>
              Gratis desde $150.000
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Despacho 24–48 h en ciudades principales. Cambio sin costo si la talla no calza, dentro de 30 días y con
              la pieza sin uso.
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80"
          alt="Hoodie Hotel"
          style={{ objectFit: 'cover', minHeight: 320 }}
        />
      </div>
    </div>
  )
}
