import type {
  ApiGame,
  GameDetail,
  GameListItem,
  RelatedTreeNode,
} from './types'

export function getImageUrl(api: ApiGame): string | null {
  return api.background_image
}

export function mapApiGameToListItem(api: ApiGame): GameListItem {
  return {
    id: api.id,
    name: api.name,
    imageUrl: getImageUrl(api),
    genres: api.genres.map((g) => g.name),
    rating: api.rating,
    released: api.released,
  }
}

export function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function mapRatingsToStats(
  ratings: ApiGame['ratings'],
): { name: string; value: number }[] {
  if (!ratings) {
    return []
  }

  return [
    { name: 'five', value: ratings.five ?? 0 },
    { name: 'four', value: ratings.four ?? 0 },
    { name: 'three', value: ratings.three ?? 0 },
    { name: 'two', value: ratings.two ?? 0 },
    { name: 'one', value: ratings.one ?? 0 },
  ].filter((entry) => entry.value > 0)
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

export function mapApiGameToDetail(
  api: ApiGame,
  description: string,
  additionsTree: RelatedTreeNode | null,
  suggestedGames: GameListItem[],
): GameDetail {
  const ratingStats = mapRatingsToStats(api.ratings)

  return {
    id: api.id,
    name: api.name,
    imageUrl: getImageUrl(api),
    genres: api.genres.map((g) => g.name),
    released: api.released,
    rating: api.rating,
    ratingsCount: api.ratings_count,
    metacritic: api.metacritic,
    playtime: api.playtime,
    description,
    ratingStats,
    ratingStatsTotal: ratingStats.reduce((sum, s) => sum + s.value, 0),
    additionsTree,
    suggestedGames,
  }
}
