import type {
  ApiAchievement,
  ApiGame,
  ApiScreenshot,
  GameDetail,
  GameListItem,
  GameRequirements,
  MetacriticPlatformScore,
  RelatedTreeNode,
} from './types'

export function getImageUrl(api: ApiGame): string | null {
  return api.background_image
}

export function getHeroImageUrl(api: ApiGame): string | null {
  return api.background_image_additional ?? api.background_image ?? null
}

export function mapApiGameToHeroItem(api: ApiGame): GameListItem & {
  heroImageUrl: string
} {
  return {
    ...mapApiGameToListItem(api),
    heroImageUrl: getHeroImageUrl(api) ?? api.background_image ?? '',
  }
}

export function mapApiGameToListItem(api: ApiGame): GameListItem {
  return {
    id: api.id,
    name: api.name,
    imageUrl: getImageUrl(api),
    genres: api.genres.map((genre) => genre.name),
    rating: api.rating,
    metacritic: api.metacritic,
    released: api.released,
  }
}

export function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatGameDescription(raw: string): string {
  return stripHtml(raw)
    .replace(/#{1,6}\s*/g, '\n\n')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function mapPcRequirements(api: ApiGame): GameRequirements | null {
  const pcEntry = (api.platforms ?? []).find(
    (entry) => entry.platform.slug === 'pc',
  )
  const requirements = pcEntry?.requirements
  if (!requirements?.minimum && !requirements?.recommended) {
    return null
  }

  return {
    minimum: requirements.minimum ?? null,
    recommended: requirements.recommended ?? null,
  }
}

function mapMetacriticPlatforms(api: ApiGame): MetacriticPlatformScore[] {
  return (api.metacritic_platforms ?? []).map((entry) => ({
    platform: entry.platform.name,
    score: entry.metascore,
    url: entry.url,
  }))
}

function parsePercent(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function mapAchievement(api: ApiAchievement) {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    percent: parsePercent(api.percent),
  }
}

export function countRelatedNodes(node: RelatedTreeNode): number {
  return (
    1 + node.children.reduce((sum, child) => sum + countRelatedNodes(child), 0)
  )
}

export function buildAdditionsTree(
  game: ApiGame,
  additions: ApiGame[],
): RelatedTreeNode | null {
  if (additions.length === 0) {
    return null
  }

  return {
    id: game.id,
    name: game.name,
    imageUrl: getImageUrl(game),
    children: additions.map((addition) => ({
      id: addition.id,
      name: addition.name,
      imageUrl: getImageUrl(addition),
      children: [],
    })),
  }
}

export function pickBaseGameFromAdditions(
  additions: ApiGame[],
  current: ApiGame,
): ApiGame | null {
  const candidates = additions.filter(
    (game) =>
      game.id !== current.id &&
      !/edition|collection|bundle|pack|goty|definitive|complete/i.test(
        game.name,
      ) &&
      !/:/.test(game.name),
  )

  if (candidates.length === 0) {
    return null
  }

  return candidates.reduce((best, game) =>
    game.name.length < best.name.length ? game : best,
  )
}

export function buildUniverseGames(
  baseGame: ApiGame,
  additions: ApiGame[],
  currentGame: ApiGame,
): GameListItem[] {
  const seen = new Set<number>()
  const items: GameListItem[] = []

  const push = (game: ApiGame) => {
    if (seen.has(game.id)) {
      return
    }
    seen.add(game.id)
    items.push(mapApiGameToListItem(game))
  }

  push(baseGame)
  for (const addition of additions) {
    push(addition)
  }
  if (currentGame.id !== baseGame.id) {
    push(currentGame)
  }

  return items
}

export function pickPrimaryParent(
  parents: ApiGame[],
  currentGameId: number,
): ApiGame | null {
  const candidates = parents.filter((parent) => parent.id !== currentGameId)
  if (candidates.length === 0) {
    return null
  }

  const withoutEdition = candidates.filter(
    (parent) => !/edition|collection|bundle|pack/i.test(parent.name),
  )
  const pool = withoutEdition.length > 0 ? withoutEdition : candidates

  return pool.reduce((best, parent) =>
    parent.name.length < best.name.length ? parent : best,
  )
}

export function mapApiGameToDetail(
  api: ApiGame,
  description: string,
  achievements: ApiAchievement[],
  screenshots: ApiScreenshot[],
  screenshotsTotal: number,
  additionsTree: RelatedTreeNode | null,
  universeGames: GameListItem[],
  suggestedGames: GameListItem[],
): GameDetail {
  const trailer = api.movies?.[0]?.data?.max ?? null

  const screenshotUrls = new Set<string>()
  const mappedScreenshots: GameDetail['screenshots'] = []

  if (api.background_image_additional) {
    screenshotUrls.add(api.background_image_additional)
    mappedScreenshots.push({
      id: -1,
      url: api.background_image_additional,
      width: 1920,
      height: 1080,
    })
  }

  for (const shot of screenshots) {
    if (screenshotUrls.has(shot.image)) {
      continue
    }
    screenshotUrls.add(shot.image)
    mappedScreenshots.push({
      id: shot.id,
      url: shot.image,
      width: shot.width,
      height: shot.height,
    })
  }

  return {
    id: api.id,
    name: api.name,
    imageUrl: getImageUrl(api),
    heroImageUrl: getHeroImageUrl(api),
    genres: api.genres.map((genre) => genre.name),
    released: api.released,
    rating: api.rating,
    ratingsCount: api.ratings_count,
    metacritic: api.metacritic,
    metacriticPlatforms: mapMetacriticPlatforms(api),
    playtime: api.playtime,
    esrbRating: api.esrb_rating?.name ?? null,
    description,
    platforms: (api.platforms ?? []).map((entry) => entry.platform.name),
    pcRequirements: mapPcRequirements(api),
    tags: (api.tags ?? []).map((tag) => tag.name),
    publishers: (api.publishers ?? []).map((publisher) => ({
      id: publisher.id,
      name: publisher.name,
    })),
    developers: (api.developers ?? []).map((developer) => ({
      id: developer.id,
      name: developer.name,
    })),
    trailerUrl: trailer,
    screenshots: mappedScreenshots,
    screenshotsTotal,
    achievements: achievements.map(mapAchievement),
    additionsTree,
    universeGames,
    suggestedGames,
  }
}
