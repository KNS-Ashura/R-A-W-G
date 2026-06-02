import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { GameCard, GameCardSkeleton } from '@/components/GameCard'
import {
  CatalogSortSelect,
  GameFiltersDrawer,
  getActiveFilterCount,
} from '@/components/GameFiltersDrawer'
import { useGameFilters } from '@/hooks/useGameFilters'
import { useGamesInfinite } from '@/hooks/useGamesCatalog'

type GamesCatalogProps = {
  title?: string
  subtitle?: string
  showPageHeader?: boolean
}

const SKELETON_COUNT = 12

export function GamesCatalog({
  title,
  subtitle,
  showPageHeader = true,
}: GamesCatalogProps) {
  const { filters } = useGameFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const catalogFilters = {
    platforms: filters.platforms,
    stores: filters.stores,
    ordering: filters.ordering,
    search: filters.search,
  }

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGamesInfinite(catalogFilters)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const games = data?.pages.flatMap((page) => page.items) ?? []
  const total = data?.pages[0]?.total ?? 0

  return (
    <section className="rawg-catalog">
      {showPageHeader && (title || subtitle) && (
        <header className="rawg-catalog__page-header">
          {title && <h1 className="rawg-catalog__page-title">{title}</h1>}
          {subtitle && <p className="rawg-catalog__page-subtitle">{subtitle}</p>}
        </header>
      )}

      <div className="rawg-catalog__toolbar">
        {!isLoading && !isError ? (
          <p className="rawg-catalog__count">
            <strong>{total.toLocaleString('fr-FR')}</strong> resultat
            {total > 1 ? 's' : ''}
            {filters.search ? (
              <>
                {' '}
                pour{' '}
                <span className="rawg-catalog__query">« {filters.search} »</span>
              </>
            ) : null}
          </p>
        ) : (
          <p className="rawg-catalog__count" role="status">
            Chargement du catalogue...
          </p>
        )}

        <div className="rawg-catalog__toolbar-actions">
          <button
            type="button"
            className="rawg-catalog__filter-btn"
            aria-expanded={filtersOpen}
            aria-controls="rawg-filter-drawer"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filtres
            {activeFilterCount > 0 && (
              <span className="rawg-catalog__filter-badge">
                {activeFilterCount}
              </span>
            )}
          </button>
          <CatalogSortSelect />
        </div>
      </div>

      <GameFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      {isLoading && (
        <ul className="rawg-games__grid">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <GameCardSkeleton key={`skeleton-${String(index)}`} />
          ))}
        </ul>
      )}

      {isError && (
        <p className="rawg-games__status rawg-games__status--error" role="alert">
          Erreur : {error.message}
        </p>
      )}

      {!isLoading && !isError && games.length === 0 && (
        <div className="rawg-catalog__empty">
          <p className="rawg-catalog__empty-title">Aucun jeu trouve</p>
          <p className="rawg-catalog__empty-text">
            Essaie une autre recherche ou ouvre les filtres pour elargir la
            recherche.
          </p>
          <button
            type="button"
            className="rawg-catalog__filter-btn rawg-catalog__filter-btn--inline"
            onClick={() => setFiltersOpen(true)}
          >
            Ouvrir les filtres
          </button>
        </div>
      )}

      {!isLoading && !isError && games.length > 0 && (
        <ul className="rawg-games__grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}

      {hasNextPage && (
        <div className="rawg-games__load-more" ref={loadMoreRef}>
          <button
            type="button"
            className="rawg-games__load-btn"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? 'Chargement...' : 'Charger plus de jeux'}
          </button>
        </div>
      )}
    </section>
  )
}
