const API = import.meta.env.VITE_API_URL || ''

export async function api(path, options = {}) {
  let response
  try {
    response = await fetch(`${API}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new Error(
      'No se pudo hablar con la API (Failed to fetch). En Vercel el backend tiene que permitir esta tienda (CORS) y estar en línea.',
    )
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || `No se pudo completar la petición (${response.status})`)
  }
  return data
}

export async function uploadFiles(files) {
  const body = new FormData()
  for (const file of files) body.append('files', file)
  const response = await fetch(`${API}/api/media`, {
    method: 'POST',
    credentials: 'include',
    body,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'No se pudo subir el archivo')
  }
  return data
}
