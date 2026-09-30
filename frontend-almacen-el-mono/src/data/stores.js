export const WHATSAPP = {
  e164: '573137538577',
  display: '313 753 8577',
}

export function whatsappLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${WHATSAPP.e164}${text}`
}

export const STORE_MAPS = 'https://maps.app.goo.gl/EtWv8E3JNPYwME2h9'

export const stores = [
  {
    id: 'la-ceja',
    city: 'La Ceja',
    name: 'Barrio Centro',
    address: 'Cra. 20 # 20-82',
    municipality: 'La Ceja del Tambo, Oriente, Antioquia',
    hint: 'Municipio de La Ceja. Tocá la foto: se abre Google Maps con la ruta para llegar.',
    transit: 'Centro del municipio · Carrera 20',
    hours: 'Lun–sáb 9:30–20:00 · Dom/fest 10:00–19:00',
    hoursLines: [
      'Lunes a sábado · 9:30 a. m. – 8:00 p. m.',
      'Domingos y festivos · 10:00 a. m. – 7:00 p. m.',
    ],
    map: STORE_MAPS,
    lat: 6.0316032,
    lng: -75.4309655,
    photo:
      'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=5.59&panoid=xRGpp4GVVZ7QKdq17IFugQ&yaw=130.68',
  },
  {
    id: 'rionegro',
    city: 'Rionegro',
    name: 'Oriente',
    address: 'Rionegro, Antioquia',
    municipality: 'Rionegro, Oriente, Antioquia',
    hint: 'Local en Rionegro. Los domingos y festivos no hay atención.',
    transit: 'Municipio de Rionegro',
    hours: 'Lun–sáb 9:00–19:30 · Dom/fest cerrado',
    hoursLines: [
      'Lunes a sábado · 9:00 a. m. – 7:30 p. m.',
      'Domingos y festivos · sin atención',
    ],
    map: 'https://www.google.com/maps/search/?api=1&query=Rionegro%20Antioquia',
    photo: '',
  },
]
