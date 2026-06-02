import { useId } from 'react'
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useFavorites } from '@/context/FavoritesContext'
import { useTheme } from '../hooks/useTheme'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-default px-3 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  )

export function Navbar() {
  const searchInputId = useId()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { theme, toggleTheme } = useTheme()
  const { favorites } = useFavorites()
  const query = searchParams.get('q') ?? ''

  const updateSearch = (value: string) => {
    if (location.pathname.startsWith('/games')) {
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
    void navigate(`/games${search ? `?${search}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <section className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <NavLink
          to="/games"
          end
          className="text-xl font-bold text-foreground no-underline hover:text-primary"
        >
          Rawg
        </NavLink>

        <nav className="flex gap-1" aria-label="Navigation principale">
          <NavLink to="/games" className={navLinkClass} end>
            Jeux
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favoris
            {favorites.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">
                {favorites.length}
              </span>
            )}
          </NavLink>
        </nav>

        <label
          className="order-3 flex min-w-56 flex-1 basis-full sm:order-none sm:ml-auto sm:max-w-sm sm:basis-auto"
          htmlFor={searchInputId}
        >
          <span className="sr-only">Rechercher un jeu par nom</span>
          <input
            id={searchInputId}
            type="search"
            role="searchbox"
            className="w-full rounded-default border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            placeholder="Rechercher…"
            value={query}
            onChange={(event) => updateSearch(event.target.value)}
            autoComplete="off"
          />
        </label>

        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-default border border-border bg-secondary text-lg text-secondary-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark'
              ? 'Activer le mode clair'
              : 'Activer le mode sombre'
          }
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </section>
    </header>
  )
}
