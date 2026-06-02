import { useQuery } from '@tanstack/react-query'
import {
  fetchPublisher,
  fetchPublisherGames,
} from '@/services/games.service'
import { gameKeys } from './queryKeys'

export function usePublisher(publisherId: string | undefined) {
  return useQuery({
    queryKey: gameKeys.publisher(publisherId ?? ''),
    queryFn: () => fetchPublisher(publisherId!),
    enabled: Boolean(publisherId),
  })
}

export function usePublisherGames(
  publisherId: string | undefined,
  page: number,
  ordering?: string,
) {
  return useQuery({
    queryKey: gameKeys.publisherGames(publisherId ?? '', page, ordering),
    queryFn: () => fetchPublisherGames(publisherId!, page, ordering),
    enabled: Boolean(publisherId),
  })
}
