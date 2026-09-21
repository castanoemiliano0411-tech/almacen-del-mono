import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, search, hash])

  return (
    <div className="app-shell">
      <div className="announce">Envío gratis en compras superiores a $200.000 · Cambios en 30 días</div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
