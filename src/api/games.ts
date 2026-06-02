import { apiGet } from './client'
import { gameEndpoints } from './endpoints'
import {
  buildAdditionsTree,
  mapApiGameToDetail,
  mapApiGameToListItem,
  stripHtml,
} from './games.mapper'
import type { ApiGame, ApiGamesListResponse, GameDetail, GameListPage } from './types'

export const GAMES_PAGE_SIZE = 24

export async function fetchGamesPage(offset: number): Promise<GameListPage> {
  const page = Math.floor(offset / GAMES_PAGE_SIZE) + 1
  const list = await apiGet<ApiGamesListResponse>(
    gameEndpoints.list(page, GAMES_PAGE_SIZE),
  )

  return {
    items: list.results.map(mapApiGameToListItem),
    total: list.count,
    hasMore: list.next !== null,
  }
}

export async function fetchGameDetail(identifier: string): Promise<GameDetail> {
  const api = await apiGet<ApiGame>(gameEndpoints.byId(identifier))

  const [additionsResponse, suggestedResponse] = await Promise.all([
    apiGet<ApiGamesListResponse>(gameEndpoints.additions(api.id)).catch(
      () => ({ count: 0, next: null, previous: null, results: [] }),
    ),
    apiGet<ApiGamesListResponse>(gameEndpoints.suggested(api.id)).catch(
      () => ({ count: 0, next: null, previous: null, results: [] }),
    ),
  ])

  const description = api.description_raw
    ? stripHtml(api.description_raw)
    : 'Aucune description disponible.'

  const additionsTree = buildAdditionsTree(api, additionsResponse.results)
  const suggestedGames = suggestedResponse.results.map(mapApiGameToListItem)

  return mapApiGameToDetail(api, description, additionsTree, suggestedGames)
}

export async function searchGames(query: string): Promise<GameListPage> {
  const normalized = query.trim()
  if (!normalized) {
    return { items: [], total: 0, hasMore: false }
  }

  const list = await apiGet<ApiGamesListResponse>(
    gameEndpoints.search(normalized, GAMES_PAGE_SIZE),
  )

  return {
    items: list.results.map(mapApiGameToListItem),
    total: list.count,
    hasMore: list.next !== null,
  }
}
