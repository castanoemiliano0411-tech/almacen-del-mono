import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { STAFF_PERMS } from '../data/roles'

export default function Panel() {
  const { user, can } = useAuth()

  return (
    <div className="container">
      <div className="page-hero">
        <p className="eyebrow">{user.role === 'admin' ? 'Administrador' : 'Trabajador'}</p>
        <h1 className="display">Operaciones</h1>
      </div>
      <p className="panel-hello">
        {user.role === 'admin'
          ? 'Tenés los dos paneles: operaciones y la tienda pública. Desde acá administrás; en la tienda ves el resultado en vivo.'
          : 'Solo ves las funciones que el administrador te habilitó. También podés entrar a la tienda para ver el catálogo.'}
      </p>
      <ul className="perm-list">
        {STAFF_PERMS.map((perm) => (
          <li key={perm.id} className={can(perm.id) ? 'on' : ''}>
            {can(perm.id) ? 'Activo' : 'Bloqueado'} · {perm.label}
          </li>
        ))}
      </ul>
      <div className="panel-grid">
        <Link className="panel-card" to="/tienda">
          <strong>Ver tienda en vivo</strong>
          <span>Mirá el catálogo público: lo que subís o bajás aparece ahí para todos.</span>
        </Link>
        {user.role === 'admin' && (
          <Link className="panel-card" to="/admin/usuarios">
            <strong>Personas e historial</strong>
            <span>Quién se registró, permisos y lo que hizo el equipo, en claro.</span>
          </Link>
        )}
        {user.role === 'admin' && (
          <Link className="panel-card" to="/admin/pedidos">
            <strong>Pedidos</strong>
            <span>Consultar compras de clientes.</span>
          </Link>
        )}
        {user.role === 'admin' && (
          <Link className="panel-card" to="/admin/registros">
            <strong>Historial</strong>
            <span>Registros, entradas al panel y cambios, fáciles de leer.</span>
          </Link>
        )}
        {(can('products') || can('brands')) && (
          <Link className="panel-card" to="/admin/productos">
            <strong>Productos</strong>
            <span>Subir piezas, fotos, precios y textos de cualquier marca.</span>
          </Link>
        )}
        {(can('ads') || can('brands')) && (
          <Link className="panel-card" to="/admin/marcas">
            <strong>Marcas nuevas</strong>
            <span>Crear una marca, subir logo y verla en la tienda al instante.</span>
          </Link>
        )}
        {(can('sizes') || can('stock')) && (
          <Link className="panel-card" to="/admin/inventario">
            <strong>Tallas y cantidades</strong>
            <span>Actualizar stock y tallas sin tocar el resto.</span>
          </Link>
        )}
        {can('ads') && (
          <Link className="panel-card" to="/admin/publicidad">
            <strong>Publicidad</strong>
            <span>Banners del inicio, marcas nuevas y productos de esas marcas.</span>
          </Link>
        )}
        {can('media') && (
          <Link className="panel-card" to="/admin/medios">
            <strong>Fotos y videos</strong>
            <span>Subir imágenes, GIF y videos. El admin puede dar este permiso a un trabajador.</span>
          </Link>
        )}
      </div>
    </div>
  )
}
