import type { GameFiltersParams } from '@/services/types'

export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (page: number, filters: GameFiltersParams) =>
    [...gameKeys.lists(), page, filters] as const,
  infinite: (filters: GameFiltersParams) =>
    [...gameKeys.all, 'infinite', 'search-fix', filters] as const,
  searches: () => [...gameKeys.all, 'search'] as const,
  search: (query: string, filters: GameFiltersParams) =>
    [...gameKeys.searches(), query, filters] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (identifier: string) =>
    [...gameKeys.details(), 'layout-v5', identifier] as const,
  platforms: () => [...gameKeys.all, 'platforms'] as const,
  stores: () => [...gameKeys.all, 'stores'] as const,
  publisher: (id: string) => [...gameKeys.all, 'publisher', id] as const,
  publisherGames: (id: string, page: number, ordering?: string) =>
    [...gameKeys.all, 'publisher-games', id, page, ordering] as const,
  trending: () => [...gameKeys.all, 'trending-hero-v2'] as const,
}
