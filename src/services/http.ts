export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getRawgApiKey(): string {
  const key = import.meta.env.VITE_RAWG_API_KEY
  if (!key) {
    throw new ApiError(
      'Cle API RAWG manquante. Ajoutez VITE_RAWG_API_KEY dans le fichier .env',
      0,
    )
  }
  return key
}

type QueryParams = Record<string, string | number | boolean | undefined>

function buildUrl(path: string, params: QueryParams = {}): string {
  const search = new URLSearchParams({ key: getRawgApiKey() })

  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(name, String(value))
    }
  }

  return `https://api.rawg.io/api${path}?${search.toString()}`
}

export const apiSession = {
  async get<T>(path: string, params: QueryParams = {}): Promise<T> {
    const response = await fetch(buildUrl(path, params))

    if (!response.ok) {
      let message = 'Erreur reseau'
      if (response.status === 404) {
        message = 'Ressource introuvable'
      } else if (response.status === 401) {
        message = 'Cle API RAWG invalide'
      }
      throw new ApiError(message, response.status)
    }

    return response.json() as Promise<T>
  },
}
