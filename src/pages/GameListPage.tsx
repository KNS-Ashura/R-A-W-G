import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FavoriteButton } from '@/components/FavoriteButton'
import { GAMES_PAGE_SIZE } from '../api/games'
import { formatReleaseDate } from '@/lib/gameLabels'
import { useGameList } from '../hooks/useGameList'
import { useGameSearch } from '../hooks/useGameSearch'

type GameListContentProps = {
  searchQuery: string
  displayQuery: string | null
}

function GameListContent({
  searchQuery,
  displayQuery,
}: GameListContentProps) {
  const [offset, setOffset] = useState(0)
  const isSearching = searchQuery.length > 0

  const listQuery = useGameList(offset)
  const searchQueryResult = useGameSearch(searchQuery)

  const { data, isLoading, isError, error, isFetching } = isSearching
    ? searchQueryResult
    : listQuery

  if (isLoading) {
    return (
      <p
        className="rounded-default bg-muted p-4 text-muted-foreground"
        role="status"
      >
        {isSearching ? 'Recherche en cours…' : 'Chargement des jeux…'}
      </p>
    )
  }

  if (isError) {
    return (
      <p
        className="rounded-default bg-destructive/15 p-4 text-destructive"
        role="alert"
      >
        Erreur : {error.message}
      </p>
    )
  }

  if (!data) {
    return null
  }

  const currentPage = Math.floor(offset / GAMES_PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(data.total / GAMES_PAGE_SIZE))

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Catalogue</h1>
        {isSearching && displayQuery && (
          <p className="mt-1 text-sm text-muted-foreground">
            {data.total} résultat{data.total > 1 ? 's' : ''} pour « {displayQuery}
            »
            {data.hasMore && ` (${String(data.items.length)} affichés)`}
            {isFetching && ' · mise à jour…'}
          </p>
        )}
      </header>

      {data.items.length === 0 ? (
        <p
          className="rounded-default bg-muted p-4 text-muted-foreground"
          role="status"
        >
          Aucun jeu trouvé
          {isSearching && displayQuery ? ` pour « ${displayQuery} »` : ''}.
        </p>
      ) : (
        <ul
          className={`mb-6 grid list-none grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4 p-0 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
        >
          {data.items.map((game) => (
            <li key={game.id}>
              <article className="relative overflow-hidden rounded-default border border-border bg-card text-card-foreground transition-colors hover:border-primary hover:shadow-md hover:shadow-primary/10">
                <FavoriteButton
                  game={{
                    id: game.id,
                    name: game.name,
                    imageUrl: game.imageUrl,
                  }}
                  className="absolute top-2 right-2 z-10"
                />
                <Link
                  to={`/games/${String(game.id)}`}
                  className="flex flex-col no-underline"
                >
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="aspect-video w-full object-cover"
                      width={176}
                      height={99}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-muted text-xs text-muted-foreground">
                      Pas d&apos;image
                    </div>
                  )}
                  <div className="flex flex-col gap-1 p-3 pt-2">
                    <span className="line-clamp-2 font-semibold leading-snug">
                      {game.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ★ {game.rating.toFixed(1)} ·{' '}
                      {formatReleaseDate(game.released)}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {game.genres.join(' · ')}
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}

      {!isSearching && (
        <nav
          className="flex flex-wrap items-center justify-center gap-4"
          aria-label="Pagination"
        >
          <button
            type="button"
            className="rounded-default border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            disabled={offset === 0}
            onClick={() =>
              setOffset((prev) => Math.max(0, prev - GAMES_PAGE_SIZE))
            }
          >
            Précédent
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="rounded-default border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            disabled={!data.hasMore}
            onClick={() => setOffset((prev) => prev + GAMES_PAGE_SIZE)}
          >
            Suivant
          </button>
        </nav>
      )}
    </>
  )
}

export function GameListPage() {
  const [searchParams] = useSearchParams()
  const displayQuery = searchParams.get('q')
  const searchQuery = displayQuery?.trim() ?? ''

  return (
    <section>
      <GameListContent
        key={searchQuery}
        searchQuery={searchQuery}
        displayQuery={displayQuery}
      />
    </section>
  )
}
