import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthProvider } from './context/AuthContext'
import { CatalogProvider } from './context/CatalogContext'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Guard from './components/Guard'
import SecretAccess from './components/SecretAccess'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Favorites from './pages/Favorites'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Panel from './pages/Panel'
import UsersAdmin from './pages/UsersAdmin'
import ProductsAdmin from './pages/ProductsAdmin'
import InventoryAdmin from './pages/InventoryAdmin'
import AdsAdmin from './pages/AdsAdmin'
import BrandsAdmin from './pages/BrandsAdmin'
import Account from './pages/Account'
import AdminAccount from './pages/AdminAccount'
import OrdersAdmin from './pages/OrdersAdmin'
import AuditAdmin from './pages/AuditAdmin'
import MediaAdmin from './pages/MediaAdmin'

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
      <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <SecretAccess />
          <Routes>
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route
              element={
                <Guard roles={['admin', 'worker']} to="/">
                  <AdminLayout />
                </Guard>
              }
            >
              <Route path="/admin/inicio" element={<Panel />} />
              <Route
                path="/admin/usuarios"
                element={
                  <Guard roles={['admin']} to="/">
                    <UsersAdmin />
                  </Guard>
                }
              />
              <Route
                path="/admin/pedidos"
                element={
                  <Guard roles={['admin']} to="/">
                    <OrdersAdmin />
                  </Guard>
                }
              />
              <Route
                path="/admin/registros"
                element={
                  <Guard roles={['admin']} to="/">
                    <AuditAdmin />
                  </Guard>
                }
              />
              <Route
                path="/admin/productos"
                element={
                  <Guard perm={['products', 'brands', 'ads']} to="/">
                    <ProductsAdmin />
                  </Guard>
                }
              />
              <Route
                path="/admin/inventario"
                element={
                  <Guard perm={['sizes', 'stock']} to="/">
                    <InventoryAdmin />
                  </Guard>
                }
              />
              <Route
                path="/admin/medios"
                element={
                  <Guard perm="media" to="/">
                    <MediaAdmin />
                  </Guard>
                }
              />
              <Route
                path="/admin/marcas"
                element={
                  <Guard perm={['ads', 'brands']} to="/">
                    <div className="container">
                      <div className="page-hero">
                        <p className="eyebrow">Staff</p>
                        <h1 className="display">Marcas</h1>
                      </div>
                      <BrandsAdmin />
                    </div>
                  </Guard>
                }
              />
              <Route
                path="/admin/publicidad"
                element={
                  <Guard perm="ads" to="/">
                    <AdsAdmin />
                  </Guard>
                }
              />
              <Route path="/admin/cuenta" element={<AdminAccount />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Shop />} />
              <Route path="/producto/:id" element={<Product />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/entrar" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route
                path="/cuenta"
                element={
                  <Guard roles={['client']}>
                    <Account />
                  </Guard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
      </FavoritesProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}
