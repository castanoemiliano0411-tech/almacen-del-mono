import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StaffStoreBar() {
  const { user, can } = useAuth()
  if (user?.role !== 'admin' && user?.role !== 'worker') return null

  return (
    <div className="staff-store-bar">
      <p>
        Estás viendo la <strong>tienda pública</strong> en vivo: lo que subís, editás o sacás se refleja acá.
      </p>
      <nav>
        <Link to="/admin/inicio">Operaciones</Link>
        <Link to="/tienda">Catálogo</Link>
        {(can('products') || can('brands')) && <Link to="/admin/productos">Productos</Link>}
        {(can('ads') || can('brands')) && <Link to="/admin/marcas">Marcas</Link>}
        {(can('stock') || can('sizes')) && <Link to="/admin/inventario">Inventario</Link>}
        {can('ads') && <Link to="/admin/publicidad">Publicidad</Link>}
        {can('media') && <Link to="/admin/medios">Medios</Link>}
      </nav>
    </div>
  )
}
