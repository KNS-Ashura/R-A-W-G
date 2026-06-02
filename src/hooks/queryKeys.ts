export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (offset: number) => [...gameKeys.lists(), offset] as const,
  searches: () => [...gameKeys.all, 'search'] as const,
  search: (query: string) => [...gameKeys.searches(), query] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (identifier: string) => [...gameKeys.details(), identifier] as const,
}
