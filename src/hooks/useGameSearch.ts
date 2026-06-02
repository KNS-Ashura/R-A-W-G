import { useQuery } from '@tanstack/react-query'
import { searchGames } from '../api/games'
import { gameKeys } from './queryKeys'

export function useGameSearch(query: string) {
  const normalized = query.trim()

  return useQuery({
    queryKey: gameKeys.search(normalized),
    queryFn: () => searchGames(normalized),
    enabled: normalized.length > 0,
  })
}
