import { useQuery } from '@tanstack/react-query'
import { fetchGameDetail } from '../api/games'
import { gameKeys } from './queryKeys'

export function useGameDetail(identifier: string | undefined) {
  return useQuery({
    queryKey: gameKeys.detail(identifier ?? ''),
    queryFn: () => fetchGameDetail(identifier!),
    enabled: Boolean(identifier),
  })
}
