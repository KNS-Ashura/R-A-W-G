import { getRawgApiKey } from './client'

export const RAWG_BASE = 'https://api.rawg.io/api'

function withKey(path: string, params: Record<string, string | number> = {}) {
  const search = new URLSearchParams({
    key: getRawgApiKey(),
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  })
  return `${RAWG_BASE}${path}?${search.toString()}`
}

export const gameEndpoints = {
  list: (page: number, pageSize: number) =>
    withKey('/games', { page, page_size: pageSize }),
  byId: (id: string | number) => withKey(`/games/${String(id)}`),
  additions: (id: number) => withKey(`/games/${String(id)}/additions`),
  suggested: (id: number) =>
    withKey(`/games/${String(id)}/suggested`, { page_size: 12 }),
  search: (query: string, pageSize: number) =>
    withKey('/games', { search: query, page_size: pageSize }),
} as const
