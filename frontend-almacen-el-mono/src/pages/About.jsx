export default function About() {
  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">Marca</p>
        <h1 className="display">Almacén del Mono</h1>
      </div>
      <div className="about-layout">
        <div>
          <p style={{ fontSize: '1.15rem', marginBottom: 18 }}>
            Somos una tienda de ropa para conocer y consultar prendas, precios, tallas y promociones sin fricción.
            El objetivo es una compra sencilla, moderna y atractiva.
          </p>
          <p style={{ color: 'var(--muted)' }}>
            Diseñamos la experiencia como un almacén contemporáneo: pocas distracciones, fotos grandes, información
            útil y una bolsa que recuerda lo que elegiste. El backend vivirá en una carpeta independiente cuando
            conectemos inventario real.
          </p>
          <div id="envios" style={{ marginTop: 28 }}>
            <p className="eyebrow">Envíos y cambios</p>
            <h2 className="display" style={{ fontSize: '2rem', margin: '8px 0 12px' }}>
              30 días para cambiar
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Envío gratis desde $200.000. Si la talla no calza, el cambio es gratuito dentro de los 30 días con la
              prenda en buen estado.
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
          alt="Espacio de tienda"
          style={{ borderRadius: 18, minHeight: 320, objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}
