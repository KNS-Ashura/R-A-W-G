import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isGameDetail = /^\/games\/[^/]+$/.test(location.pathname)
  const isCatalogPage = location.pathname === '/games'

  const mainClass = isHome
    ? 'rawg-layout__main rawg-layout__main--home'
    : isGameDetail
      ? 'rawg-layout__main rawg-layout__main--detail'
      : isCatalogPage
        ? 'rawg-layout__main rawg-layout__main--catalog'
        : 'rawg-layout__main'

  return (
    <div className="rawg-layout">
      <Navbar />
      <main className={mainClass}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
