import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import StaffStoreBar from './StaffStoreBar'

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: pathname === '/' ? 'smooth' : 'instant' })
  }, [pathname, hash])

  return (
    <div className="app-shell">
      <StaffStoreBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
