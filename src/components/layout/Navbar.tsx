import { useId } from 'react'
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useTheme } from '@/hooks/useTheme'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'rawg-nav__link rawg-nav__link--active' : 'rawg-nav__link'
}

export function Navbar() {
  const searchInputId = useId()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { theme, toggleTheme } = useTheme()
  const { favorites } = useFavorites()
  const query = searchParams.get('q') ?? ''

  const updateSearch = (value: string) => {
    const onCatalog =
      location.pathname === '/' || location.pathname.startsWith('/games')

    if (onCatalog) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) {
            next.set('q', value)
          } else {
            next.delete('q')
          }
          return next
        },
        { replace: true },
      )
      return
    }

    const params = new URLSearchParams()
    if (value) {
      params.set('q', value)
    }
    const search = params.toString()
    void navigate(`/${search ? `?${search}` : ''}`)
  }

  return (
    <header className="rawg-nav">
      <section className="rawg-nav__inner">
        <NavLink to="/" className="rawg-nav__brand">
          RAWG
        </NavLink>

        <nav className="rawg-nav__links" aria-label="Navigation principale">
          <NavLink to="/" end className={navLinkClass}>
            Accueil
          </NavLink>
          <NavLink to="/games" className={navLinkClass}>
            Jeux
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favoris
            {favorites.length > 0 && (
              <span className="rawg-nav__badge"> ({favorites.length})</span>
            )}
          </NavLink>
        </nav>

        <label className="rawg-nav__search" htmlFor={searchInputId}>
          <span className="sr-only">Rechercher un jeu par nom</span>
          <input
            id={searchInputId}
            type="search"
            role="searchbox"
            className="rawg-nav__search-input"
            placeholder="Rechercher..."
            value={query}
            onChange={(event) => updateSearch(event.target.value)}
            autoComplete="off"
          />
        </label>

        <button
          type="button"
          className="rawg-nav__theme-btn"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark'
              ? 'Activer le mode clair'
              : 'Activer le mode sombre'
          }
        >
          {theme === 'dark' ? (
            <Sun className="size-4" aria-hidden />
          ) : (
            <Moon className="size-4" aria-hidden />
          )}
        </button>
      </section>
    </header>
  )
}
