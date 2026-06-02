import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { GameFiltersParams } from '@/services/types'

export function useGameFilters(): {
  filters: GameFiltersParams
  setFilter: (key: keyof GameFiltersParams, value: string) => void
  clearFilters: () => void
} {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<GameFiltersParams>(
    () => ({
      platforms: searchParams.get('platforms') ?? undefined,
      stores: searchParams.get('stores') ?? undefined,
      ordering: searchParams.get('ordering') ?? '-rating',
      search: searchParams.get('q')?.trim() || undefined,
    }),
    [searchParams],
  )

  const setFilter = (key: keyof GameFiltersParams, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!value) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
        return next
      },
      { replace: true },
    )
  }

  const clearFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams()
        const query = prev.get('q')
        if (query) {
          next.set('q', query)
        }
        return next
      },
      { replace: true },
    )
  }

  return { filters, setFilter, clearFilters }
}
