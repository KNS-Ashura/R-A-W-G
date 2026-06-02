import { useQuery } from '@tanstack/react-query'
import { fetchGameDetail } from '@/services/games.service'
import { gameKeys } from './queryKeys'

export function useGameDetail(identifier: string | undefined) {
  return useQuery({
    queryKey: gameKeys.detail(identifier ?? ''),
    queryFn: () => fetchGameDetail(identifier!),
    enabled: Boolean(identifier),
  })
}
