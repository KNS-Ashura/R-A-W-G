import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'react-toastify'
import {
  type FavoriteGame,
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from './favoritesStorage'

type FavoritesContextValue = {
  favorites: FavoriteGame[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (game: FavoriteGame) => void
  removeFavorite: (id: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteGame[]>(() =>
    loadFavoritesFromStorage(),
  )

  const persist = useCallback((next: FavoriteGame[]) => {
    setFavorites(next)
    saveFavoritesToStorage(next)
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.some((entry) => entry.id === id),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (game: FavoriteGame) => {
      const exists = favorites.some((entry) => entry.id === game.id)
      if (exists) {
        const next = favorites.filter((entry) => entry.id !== game.id)
        persist(next)
        toast.info(`${game.name} retire des favoris`)
        return
      }

      persist([...favorites, game])
      toast.success(`${game.name} ajoute aux favoris`)
    },
    [favorites, persist],
  )

  const removeFavorite = useCallback(
    (id: number) => {
      const game = favorites.find((entry) => entry.id === id)
      if (!game) {
        return
      }

      const next = favorites.filter((entry) => entry.id !== id)
      persist(next)
      toast.info(`${game.name} retire des favoris`)
    },
    [favorites, persist],
  )

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
    }),
    [favorites, isFavorite, toggleFavorite, removeFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites doit etre utilise dans un FavoritesProvider')
  }
  return context
}

export type { FavoriteGame }
