export type ApiGenre = {
  id: number
  name: string
  slug: string
}

export type ApiTag = {
  id: number
  name: string
  slug: string
}

export type ApiPlatformRef = {
  platform: {
    id: number
    name: string
    slug: string
  }
  released_at?: string | null
  requirements?: {
    minimum?: string | null
    recommended?: string | null
  } | null
}

export type ApiMetacriticPlatform = {
  metascore: number
  url?: string
  platform: {
    platform: number
    name: string
    slug: string
  }
}

export type ApiCompany = {
  id: number
  name: string
  slug: string
}

export type ApiMovie = {
  id: number
  name: string
  preview: string
  data: {
    max: string
  }
}

export type ApiEsrbRating = {
  id: number
  slug: string
  name: string
}

export type ApiGame = {
  id: number
  slug: string
  name: string
  released: string | null
  background_image: string | null
  background_image_additional?: string | null
  rating: number
  ratings_count: number
  metacritic: number | null
  playtime: number
  description_raw?: string
  genres: ApiGenre[]
  platforms?: ApiPlatformRef[]
  metacritic_platforms?: ApiMetacriticPlatform[]
  tags?: ApiTag[]
  publishers?: ApiCompany[]
  developers?: ApiCompany[]
  movies?: ApiMovie[]
  esrb_rating?: ApiEsrbRating | null
}

export type ApiGamesListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: ApiGame[]
}

export type ApiScreenshotsResponse = {
  count: number
  results: ApiScreenshot[]
}

export type ApiScreenshot = {
  id: number
  image: string
  width: number
  height: number
}

export type ApiAchievement = {
  id: number
  name: string
  description: string
  image: string
  percent: string
}

export type ApiAchievementsResponse = {
  count: number
  results: ApiAchievement[]
}

export type ApiPlatform = {
  id: number
  name: string
  slug: string
}

export type ApiPlatformsResponse = {
  count: number
  results: ApiPlatform[]
}

export type ApiStore = {
  id: number
  name: string
  slug: string
  domain?: string
}

export type ApiStoresResponse = {
  count: number
  results: ApiStore[]
}

export type ApiPublisher = {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string | null
}

export type GameListItem = {
  id: number
  name: string
  imageUrl: string | null
  genres: string[]
  rating: number
  metacritic: number | null
  released: string | null
}

export type RelatedTreeNode = {
  id: number
  name: string
  imageUrl: string | null
  children: RelatedTreeNode[]
}

export type GameRequirements = {
  minimum: string | null
  recommended: string | null
}

export type MetacriticPlatformScore = {
  platform: string
  score: number
  url?: string
}

export type GameDetail = {
  id: number
  name: string
  imageUrl: string | null
  heroImageUrl: string | null
  genres: string[]
  released: string | null
  rating: number
  ratingsCount: number
  metacritic: number | null
  metacriticPlatforms: MetacriticPlatformScore[]
  playtime: number
  esrbRating: string | null
  description: string
  platforms: string[]
  pcRequirements: GameRequirements | null
  tags: string[]
  publishers: { id: number; name: string }[]
  developers: { id: number; name: string }[]
  trailerUrl: string | null
  screenshots: { id: number; url: string; width: number; height: number }[]
  screenshotsTotal: number
  achievements: { id: number; name: string; description: string; percent: number }[]
  additionsTree: RelatedTreeNode | null
  universeGames: GameListItem[]
  suggestedGames: GameListItem[]
}

export type GameListPage = {
  items: GameListItem[]
  total: number
  hasMore: boolean
}

export type GameFiltersParams = {
  platforms?: string
  stores?: string
  ordering?: string
  search?: string
  publishers?: string
}

export const ORDERING_OPTIONS = [
  { value: '-rating', label: 'Note (decroissant)' },
  { value: 'rating', label: 'Note (croissant)' },
  { value: '-released', label: 'Date de sortie (recent)' },
  { value: 'released', label: 'Date de sortie (ancien)' },
  { value: 'name', label: 'Nom (A-Z)' },
  { value: '-name', label: 'Nom (Z-A)' },
  { value: '-metacritic', label: 'Metacritic (decroissant)' },
  { value: '-added', label: 'Popularite' },
] as const
