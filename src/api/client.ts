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
      'Clé API RAWG manquante. Ajoutez VITE_RAWG_API_KEY dans le fichier .env',
      0,
    )
  }
  return key
}

export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    let message = 'Erreur réseau'
    if (response.status === 404) {
      message = 'Ressource introuvable'
    } else if (response.status === 401) {
      message = 'Clé API RAWG invalide'
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}
