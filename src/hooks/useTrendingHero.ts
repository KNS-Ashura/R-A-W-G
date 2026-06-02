import { useQuery } from '@tanstack/react-query'
import { fetchTrendingHeroGames } from '@/services/games.service'
import { gameKeys } from './queryKeys'

export function useTrendingHero() {
  return useQuery({
    queryKey: gameKeys.trending(),
    queryFn: fetchTrendingHeroGames,
    staleTime: 1000 * 60 * 10,
  })
}
