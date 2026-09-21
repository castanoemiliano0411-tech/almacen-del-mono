# Backend — Almacén del Mono

API REST con **Express** para el catálogo, pedidos y contacto. Pedidos y mensajes se guardan en memoria (se pierden al reiniciar).

## Requisitos

- Node.js 20+

## Arranque

```bash
cd backend-almacen-el-mono
cp .env.example .env
npm install
npm run dev
```

La API queda en `http://localhost:4000`.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio |
| `GET` | `/api/categories` | Categorías |
| `GET` | `/api/products` | Catálogo (`category`, `q`, `featured`) |
| `GET` | `/api/products/:id` | Ficha de producto |
| `POST` | `/api/orders` | Crear pedido (precios se recalculan en el servidor) |
| `GET` | `/api/orders/:id` | Consultar pedido |
| `POST` | `/api/contact` | Mensaje de contacto |

Envío de envío gratis desde $200.000 COP; si no, $12.000.
