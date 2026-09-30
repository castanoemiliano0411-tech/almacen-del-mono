# Almacén del Mono

Tienda de ropa para consultar prendas, precios, tallas y promociones. Experiencia sencilla, moderna y atractiva.

## Estructura

- `frontend-almacen-el-mono/` — PWA con Vite, React y JavaScript.
- `backend-almacen-el-mono/` — API REST con Express.

## Frontend

```bash
cd frontend-almacen-el-mono
npm install
npm run dev
```

Detalle en [`frontend-almacen-el-mono/README.md`](frontend-almacen-el-mono/README.md).

## Backend

```bash
cd backend-almacen-el-mono
cp .env.example .env
npm install
npm run dev
```

API en `http://localhost:4000`. Detalle en [`backend-almacen-el-mono/README.md`](backend-almacen-el-mono/README.md).

## Vercel (dos proyectos)

`https://almacen-del-mono.vercel.app` es **solo la API**. Abrir esa dirección en el navegador no muestra la tienda: si ves `Cannot GET /`, es porque falta desplegar esta versión (ruta `/`) o estás mirando la API como si fuera el sitio.

1. **Backend** (el que ya tenés): Root Directory = `backend-almacen-el-mono`. Variables: `MYSQL_*`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NODE_ENV=production`, `COOKIE_SAMESITE=None`, `CORS_ORIGIN` = la URL del frontend (cuando exista). Comprobá [https://almacen-del-mono.vercel.app/api/health](https://almacen-del-mono.vercel.app/api/health).
2. **Frontend** (proyecto nuevo en Vercel): Root Directory = `frontend-almacen-el-mono`. Variable `VITE_API_URL=https://almacen-del-mono.vercel.app` (sin barra al final). Framework Vite. Esa URL nueva es la tienda.
3. Volvé al backend y actualizá `CORS_ORIGIN` con la URL del frontend. Redeploy.
