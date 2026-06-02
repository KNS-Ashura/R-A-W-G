export type FavoriteGame = {
  id: number
  name: string
  imageUrl: string | null
}

export const FAVORITES_STORAGE_KEY = 'rawg-favorites'

export function loadFavoritesFromStorage(): FavoriteGame[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isFavoriteGame)
  } catch {
    return []
  }
}

function isFavoriteGame(value: unknown): value is FavoriteGame {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'number' &&
    typeof record.name === 'string' &&
    (record.imageUrl === null || typeof record.imageUrl === 'string')
  )
}

export function saveFavoritesToStorage(favorites: FavoriteGame[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}
