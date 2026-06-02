import { useQuery } from '@tanstack/react-query'
import { fetchGamesPage } from '../api/games'
import { gameKeys } from './queryKeys'

export function useGameList(offset: number) {
  return useQuery({
    queryKey: gameKeys.list(offset),
    queryFn: () => fetchGamesPage(offset),
  })
}
