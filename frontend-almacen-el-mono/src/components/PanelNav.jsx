import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PanelNav() {
  const { user, can } = useAuth()

  return (
    <nav className="panel-nav" aria-label="Operaciones">
      <NavLink to="/admin/inicio" end>
        Inicio
      </NavLink>
      {user?.role === 'admin' && <NavLink to="/admin/usuarios">Personas</NavLink>}
      {user?.role === 'admin' && <NavLink to="/admin/pedidos">Pedidos</NavLink>}
      {user?.role === 'admin' && <NavLink to="/admin/registros">Historial</NavLink>}
      <NavLink to="/tienda">Tienda</NavLink>
      {(can('products') || can('brands')) && <NavLink to="/admin/productos">Productos</NavLink>}
      {(can('ads') || can('brands')) && <NavLink to="/admin/marcas">Marcas</NavLink>}
      {(can('sizes') || can('stock')) && <NavLink to="/admin/inventario">Inventario</NavLink>}
      {can('ads') && <NavLink to="/admin/publicidad">Publicidad</NavLink>}
      {can('media') && <NavLink to="/admin/medios">Medios</NavLink>}
      <NavLink to="/admin/cuenta">Cuenta</NavLink>
    </nav>
  )
}
