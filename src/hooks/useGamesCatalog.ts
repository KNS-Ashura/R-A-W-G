import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchGamesPage,
  fetchPlatforms,
  fetchStores,
  GAMES_PAGE_SIZE,
  searchGames,
} from '@/services/games.service'
import type { GameFiltersParams } from '@/services/types'
import { gameKeys } from './queryKeys'

export function useFilterOptions() {
  const platformsQuery = useQuery({
    queryKey: gameKeys.platforms(),
    queryFn: fetchPlatforms,
    staleTime: 1000 * 60 * 60,
  })

  const storesQuery = useQuery({
    queryKey: gameKeys.stores(),
    queryFn: fetchStores,
    staleTime: 1000 * 60 * 60,
  })

  return {
    platforms: platformsQuery.data ?? [],
    stores: storesQuery.data ?? [],
    isLoading: platformsQuery.isLoading || storesQuery.isLoading,
  }
}

function fetchCatalogPage(page: number, filters: GameFiltersParams) {
  const search = filters.search?.trim() ?? ''
  if (search) {
    return searchGames(search, page, filters)
  }
  return fetchGamesPage(page, filters)
}

export function useGamesInfinite(filters: GameFiltersParams) {
  return useInfiniteQuery({
    queryKey: gameKeys.infinite(filters),
    queryFn: ({ pageParam }) => fetchCatalogPage(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
  })
}

export { GAMES_PAGE_SIZE }
