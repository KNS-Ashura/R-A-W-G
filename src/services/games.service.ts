import {
  filterAdultGames,
  isAdultGame,
  RAWG_EXCLUDE_ADULT_COLLECTIONS,
} from './adultFilter'
import { apiSession, ApiError } from './http'
import {
  buildAdditionsTree,
  buildUniverseGames,
  formatGameDescription,
  getHeroImageUrl,
  mapApiGameToDetail,
  mapApiGameToHeroItem,
  mapApiGameToListItem,
  pickBaseGameFromAdditions,
  pickPrimaryParent,
} from './games.mapper'
import type {
  ApiAchievementsResponse,
  ApiGame,
  ApiGamesListResponse,
  ApiPlatformsResponse,
  ApiPublisher,
  ApiScreenshotsResponse,
  ApiStoresResponse,
  GameFiltersParams,
  GameListPage,
  GameDetail,
} from './types'

export const GAMES_PAGE_SIZE = 20

const emptyList: ApiGamesListResponse = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}

async function fetchGameAdditions(gameId: number) {
  return apiSession
    .get<ApiGamesListResponse>(`/games/${String(gameId)}/additions`)
    .catch(() => emptyList)
}

async function fetchParentGames(gameId: number) {
  return apiSession
    .get<ApiGamesListResponse>(`/games/${String(gameId)}/parent-games`)
    .catch(() => emptyList)
}

function isEditionLike(name: string) {
  return /edition|collection|bundle|pack|goty|definitive|complete/i.test(name)
}

async function resolveDlcContent(api: ApiGame) {
  const [additionsResponse, parentResponse] = await Promise.all([
    fetchGameAdditions(api.id),
    fetchParentGames(api.id),
  ])

  const directAdditions = filterAdultGames(additionsResponse.results)
  const parents = filterAdultGames(parentResponse.results)
  const parent = pickPrimaryParent(parents, api.id)

  let baseGame = api
  let additions = directAdditions

  if (parent) {
    baseGame = parent
    additions = filterAdultGames((await fetchGameAdditions(parent.id)).results)
  } else if (isEditionLike(api.name)) {
    const baseInAdditions = pickBaseGameFromAdditions(directAdditions, api)
    if (baseInAdditions) {
      baseGame = baseInAdditions
      additions = filterAdultGames(
        (await fetchGameAdditions(baseInAdditions.id)).results,
      )
    }
  }

  if (additions.length === 0) {
    return { additionsTree: null, universeGames: [] }
  }

  return {
    additionsTree: buildAdditionsTree(baseGame, additions),
    universeGames: buildUniverseGames(baseGame, additions, api),
  }
}

type ListQuery = GameFiltersParams & {
  page: number
  page_size?: number
}

async function fetchGamesList(query: ListQuery): Promise<GameListPage> {
  const hasSearch = Boolean(query.search?.trim())

  const list = await apiSession.get<ApiGamesListResponse>('/games', {
    page: query.page,
    page_size: query.page_size ?? GAMES_PAGE_SIZE,
    platforms: query.platforms,
    stores: query.stores,
    ordering: hasSearch ? undefined : query.ordering,
    search: query.search,
    publishers: query.publishers,
    exclude_collection: RAWG_EXCLUDE_ADULT_COLLECTIONS,
  })

  const safeGames = filterAdultGames(list.results)

  return {
    items: safeGames.map(mapApiGameToListItem),
    total: list.count,
    hasMore: list.next !== null,
  }
}

export async function fetchGamesPage(
  page: number,
  filters: GameFiltersParams,
): Promise<GameListPage> {
  return fetchGamesList({ page, ...filters })
}

export async function searchGames(
  query: string,
  page: number,
  filters: GameFiltersParams,
): Promise<GameListPage> {
  const normalized = query.trim()
  if (!normalized) {
    return { items: [], total: 0, hasMore: false }
  }

  return fetchGamesList({
    page,
    page_size: GAMES_PAGE_SIZE,
    search: normalized,
    ...filters,
  })
}

export async function fetchGameDetail(identifier: string): Promise<GameDetail> {
  const api = await apiSession.get<ApiGame>(`/games/${identifier}`)

  if (isAdultGame(api)) {
    throw new ApiError('Jeu non disponible (contenu adulte)', 404)
  }
  const [achievementsResponse, screenshotsResponse, suggestedResponse, dlcContent] =
    await Promise.all([
      apiSession
        .get<ApiAchievementsResponse>(`/games/${String(api.id)}/achievements`)
        .catch(() => ({ count: 0, results: [] })),
      apiSession
        .get<ApiScreenshotsResponse>(`/games/${String(api.id)}/screenshots`, {
          page_size: 12,
        })
        .catch(() => ({ count: 0, results: [] })),
      apiSession
        .get<ApiGamesListResponse>(`/games/${String(api.id)}/suggested`, {
          page_size: 12,
        })
        .catch(() => emptyList),
      resolveDlcContent(api),
    ])

  const description = api.description_raw
    ? formatGameDescription(api.description_raw)
    : 'Aucune description disponible.'

  const safeSuggested = filterAdultGames(suggestedResponse.results).map(
    mapApiGameToListItem,
  )

  return mapApiGameToDetail(
    api,
    description,
    achievementsResponse.results,
    screenshotsResponse.results,
    screenshotsResponse.count,
    dlcContent.additionsTree,
    dlcContent.universeGames,
    safeSuggested,
  )
}

export async function fetchPlatforms() {
  const response = await apiSession.get<ApiPlatformsResponse>('/platforms', {
    page_size: 40,
  })
  return response.results
}

export async function fetchStores() {
  const response = await apiSession.get<ApiStoresResponse>('/stores', {
    page_size: 40,
  })
  return response.results
}

export async function fetchPublisher(id: string): Promise<ApiPublisher> {
  return apiSession.get<ApiPublisher>(`/publishers/${id}`)
}

export async function fetchPublisherGames(
  publisherId: string,
  page: number,
  ordering?: string,
): Promise<GameListPage> {
  return fetchGamesList({
    page,
    publishers: publisherId,
    ordering: ordering ?? '-rating',
  })
}

export async function fetchTrendingHeroGames() {
  const list = await apiSession.get<ApiGamesListResponse>('/games', {
    page: 1,
    page_size: 16,
    ordering: '-added',
    exclude_collection: RAWG_EXCLUDE_ADULT_COLLECTIONS,
  })

  return filterAdultGames(list.results)
    .filter((game) => getHeroImageUrl(game) || game.background_image)
    .slice(0, 6)
    .map(mapApiGameToHeroItem)
}
