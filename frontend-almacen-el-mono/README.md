# Frontend — Almacén del Mono

PWA de la tienda de moda, hecha con **Vite + React + JavaScript**. El catálogo local vive en `src/data/products.js`. La API Express está en `backend-almacen-el-mono/` (`http://localhost:4000`).

## Requisitos

- Node.js 20+

## Arranque

```bash
cd frontend-almacen-el-mono
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción + service worker |
| `npm run preview` | Previsualiza el build (necesario para probar la PWA instalable) |

## Rutas

- `/` inicio editorial
- `/tienda` catálogo y filtros
- `/producto/:id` ficha con talla, color y bolsa
- `/carrito` y `/checkout`
- `/nosotros` y `/contacto`

El carrito se guarda en `localStorage` para que la PWA recuerde la bolsa offline.

## Diseño

El archivo de [Figma Make](https://www.figma.com/make/Wjq8DEEPEkD4MerGrcwM17/E-commerce-Fashion-Website) no es público (pide sesión). Esta UI sigue el patrón de esas tiendas de moda: barra de anuncio, tipografía editorial, hero a pantalla, categorías, grilla de producto, ficha y checkout en paleta crema / tinta / terracota.
