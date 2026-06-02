export type ApiGenre = {
  id: number
  name: string
  slug: string
}

export type ApiGame = {
  id: number
  slug: string
  name: string
  released: string | null
  background_image: string | null
  rating: number
  ratings_count: number
  metacritic: number | null
  playtime: number
  description_raw?: string
  genres: ApiGenre[]
  ratings?: {
    top?: number
    five?: number
    four?: number
    three?: number
    two?: number
    one?: number
  }
}

export type ApiGamesListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: ApiGame[]
}

export type GameListItem = {
  id: number
  name: string
  imageUrl: string | null
  genres: string[]
  rating: number
  released: string | null
}

export type RelatedTreeNode = {
  id: number
  name: string
  imageUrl: string | null
  children: RelatedTreeNode[]
}

export type GameDetail = {
  id: number
  name: string
  imageUrl: string | null
  genres: string[]
  released: string | null
  rating: number
  ratingsCount: number
  metacritic: number | null
  playtime: number
  description: string
  ratingStats: { name: string; value: number }[]
  ratingStatsTotal: number
  additionsTree: RelatedTreeNode | null
  suggestedGames: GameListItem[]
}

export type GameListPage = {
  items: GameListItem[]
  total: number
  hasMore: boolean
}
