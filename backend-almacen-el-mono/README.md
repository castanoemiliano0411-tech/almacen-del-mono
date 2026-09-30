# Backend — El Almacén del Mono

API REST con Express y MySQL (Clever Cloud). El pool de la base usa **máximo 5 conexiones**.

Los visitantes pueden **ver el catálogo sin cuenta**. El tope de 5 peticiones por sesión anónima no aplica a lecturas públicas (productos, categorías, tiendas, publicidad).

## Arranque

```bash
cd backend-almacen-el-mono
cp .env.example .env
npm install
npm run migrate
npm run seed:admin
npm start
```

La API queda en `http://localhost:4000`. En producción usá HTTPS: el cookie de sesión lleva `Secure` cuando `NODE_ENV=production`.

En Vercel, Root Directory debe ser esta carpeta. `GET /` y `GET /api/health` confirman que la API está viva. `COOKIE_SAMESITE=None` si el frontend está en otro dominio.

## Roles

- **Visitante:** ve productos, precios, categorías y publicidad sin registrarse.
- **Cliente:** se crea en `/registro` o al pagar. Compra y ve `/cuenta`. No entra a operaciones.
- **Trabajador:** solo lo que el admin habilite (productos, tallas, stock, publicidad). Credenciales propias.
- **Administrador:** control general. Convierte cliente ↔ trabajador y marca permisos.

El acceso de operaciones **no está en el menú**. El formulario interno se abre con una combinación de teclas en el sitio (solo descubre el formulario). Las credenciales, el rol y los permisos los comprueba el servidor. Ir a `/admin` no alcanza.

Definí `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`. `npm run seed:admin` guarda un **hash bcrypt**, nunca la clave en claro. Cambiá esa clave después del primer acceso (panel → Cuenta).

Opcional: `ADMIN_2FA_CODE` o `ADMIN_TOTP_SECRET` para un segundo factor del administrador.

Hay tope de intentos fallidos de login interno, sesiones con vencimiento por inactividad, y `GET /api/auth/audit` para el administrador.

El registro público y el checkout crean solo **clientes**.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio |
| `GET` | `/api/categories` | Categorías |
| `POST` | `/api/categories` | Crear/editar categoría (admin) |
| `GET` | `/api/products` | Catálogo (`category`, `q`, `featured`) |
| `GET` | `/api/products/:id` | Ficha de producto |
| `DELETE` | `/api/products/:id` | Borrar producto (permiso products) |
| `GET` | `/api/stores` | Tiendas físicas |
| `POST` | `/api/auth/register` | Alta de cliente |
| `POST` | `/api/auth/login` | Login de cliente |
| `POST` | `/api/auth/staff/login` | Login interno |
| `POST` | `/api/auth/staff/2fa` | Segundo factor del admin (si está configurado) |
| `GET` | `/api/auth/users` | Usuarios (admin; filtros `q`, `role`, `status`) |
| `GET` | `/api/auth/audit` | Bitácora (admin) |
| `GET` | `/api/orders` | Pedidos (admin) |
| `POST` | `/api/orders` | Crear pedido (cliente) |

Envío gratis desde $150.000 COP; si no, $12.000.
