const RATING_LABELS: Record<string, string> = {
  five: '5 étoiles',
  four: '4 étoiles',
  three: '3 étoiles',
  two: '2 étoiles',
  one: '1 étoile',
}

export function getRatingLabel(name: string): string {
  return RATING_LABELS[name] ?? name
}

export function getGenreBadgeClass(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]/g, '')
  return `genre-badge genre-${safe}`
}

export function formatReleaseDate(iso: string | null): string {
  if (!iso) {
    return 'Date inconnue'
  }
  return new Date(iso).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const MAX_RATING_STAT_VALUE = 1000
