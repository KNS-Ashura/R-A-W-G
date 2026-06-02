import type { ApiGame } from './types'

/** Collections "ADULT" sur RAWG (GET /collections?search=adult) */
export const RAWG_EXCLUDE_ADULT_COLLECTIONS = '14606,34470,36693'

/** AO uniquement — "mature" (17+) inclut la majorité des AAA (Cyberpunk, Bloodborne…) */
const BLOCKED_ESRB_SLUGS = new Set(['adults-only'])

/** Tags explicites jeux adultes / porn — pas nudity/mature des jeux AAA */
const BLOCKED_TAG_SLUGS = new Set([
  'adult',
  'adult-content',
  'adult-games',
  'adult-game',
  'adult-themes',
  'adult-orientated',
  'adult-adventure',
  'nsfw',
  'hentai',
  'eroge',
  'porn',
])

const BLOCKED_NAME_PATTERN =
  /\b(nsfw|hentai|eroge|porn|sex simulator|sex club|adult game)\b/i

export function isAdultGame(game: ApiGame): boolean {
  const esrbSlug = game.esrb_rating?.slug
  if (esrbSlug && BLOCKED_ESRB_SLUGS.has(esrbSlug)) {
    return true
  }

  if ((game.tags ?? []).some((tag) => BLOCKED_TAG_SLUGS.has(tag.slug))) {
    return true
  }

  return BLOCKED_NAME_PATTERN.test(game.name)
}

export function filterAdultGames(games: ApiGame[]): ApiGame[] {
  return games.filter((game) => !isAdultGame(game))
}
