export const WHATSAPP = {
  e164: '573004182291',
  display: '+57 300 418 2291',
}

export function whatsappLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${WHATSAPP.e164}${text}`
}

export const stores = [
  {
    id: 'bogota',
    city: 'Bogotá',
    name: 'Chapinero',
    address: 'Cra. 7 # 45-12',
    hint: 'Esquina de la 45 con carrera 7, local con vitrina negra. Frente al costado oriental.',
    transit: 'TransMilenio Calle 45 · 3 minutos a pie',
    hours: 'Lun–sáb · 11:00 a 19:00',
    map: 'https://www.google.com/maps/search/?api=1&query=Carrera%207%20%2345-12%20Bogot%C3%A1',
  },
  {
    id: 'medellin',
    city: 'Medellín',
    name: 'El Poblado',
    address: 'Cll. 10 # 43A-42',
    hint: 'Cuadra de Provenza. Puerta negra, letrero lima Almacén del Mono.',
    transit: 'Metro Poblado · 8 minutos a pie',
    hours: 'Lun–sáb · 11:00 a 19:00',
    map: 'https://www.google.com/maps/search/?api=1&query=Calle%2010%20%2343A-42%20El%20Poblado%20Medell%C3%ADn',
  },
]
