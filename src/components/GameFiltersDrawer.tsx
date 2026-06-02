import { useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { ORDERING_OPTIONS } from '@/services/types'
import { useFilterOptions } from '@/hooks/useGamesCatalog'
import { useGameFilters } from '@/hooks/useGameFilters'

type GameFiltersDrawerProps = {
  open: boolean
  onClose: () => void
}

function countActiveFilters(filters: ReturnType<typeof useGameFilters>['filters']) {
  let count = 0
  if (filters.platforms) count += 1
  if (filters.stores) count += 1
  if (filters.ordering && filters.ordering !== '-rating') count += 1
  return count
}

export function getActiveFilterCount(
  filters: ReturnType<typeof useGameFilters>['filters'],
) {
  return countActiveFilters(filters)
}

function FiltersPanelContent({ onClose }: { onClose: () => void }) {
  const { filters, setFilter, clearFilters } = useGameFilters()
  const { platforms, stores, isLoading } = useFilterOptions()
  const hasActiveFilters = countActiveFilters(filters) > 0

  return (
    <div className="rawg-filters__body">
      <section className="rawg-filters__section">
        <h3 className="rawg-filters__section-title">Plateforme</h3>
        <select
          id="rawg-filter-platform"
          className="rawg-filters__select"
          value={filters.platforms ?? ''}
          disabled={isLoading}
          onChange={(event) => setFilter('platforms', event.target.value)}
        >
          <option value="">Toutes les plateformes</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={String(platform.id)}>
              {platform.name}
            </option>
          ))}
        </select>
      </section>

      <section className="rawg-filters__section">
        <h3 className="rawg-filters__section-title">Store</h3>
        <select
          id="rawg-filter-store"
          className="rawg-filters__select"
          value={filters.stores ?? ''}
          disabled={isLoading}
          onChange={(event) => setFilter('stores', event.target.value)}
        >
          <option value="">Tous les stores</option>
          {stores.map((store) => (
            <option key={store.id} value={String(store.id)}>
              {store.name}
            </option>
          ))}
        </select>
      </section>

      <section className="rawg-filters__section">
        <h3 className="rawg-filters__section-title">Tri</h3>
        <select
          id="rawg-filter-ordering"
          className="rawg-filters__select"
          value={filters.ordering ?? '-rating'}
          disabled={Boolean(filters.search)}
          onChange={(event) => setFilter('ordering', event.target.value)}
        >
          {ORDERING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {filters.search && (
          <p className="rawg-filters__hint">
            Tri desactive pendant la recherche (pertinence RAWG).
          </p>
        )}
      </section>

      <div className="rawg-filters__footer">
        {hasActiveFilters && (
          <button
            type="button"
            className="rawg-filters__reset"
            onClick={() => {
              clearFilters()
            }}
          >
            Reinitialiser
          </button>
        )}
        <button
          type="button"
          className="rawg-filters__apply"
          onClick={onClose}
        >
          Voir les resultats
        </button>
      </div>
    </div>
  )
}

export function GameFiltersDrawer({ open, onClose }: GameFiltersDrawerProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={
          open
            ? 'rawg-filter-drawer__backdrop rawg-filter-drawer__backdrop--open'
            : 'rawg-filter-drawer__backdrop'
        }
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        id="rawg-filter-drawer"
        className={
          open ? 'rawg-filter-drawer rawg-filter-drawer--open' : 'rawg-filter-drawer'
        }
        role="dialog"
        aria-modal="true"
        aria-label="Filtres du catalogue"
        aria-hidden={!open}
      >
        <header className="rawg-filter-drawer__head">
          <div className="rawg-filter-drawer__head-title">
            <SlidersHorizontal className="size-4" aria-hidden />
            <h2>Filtres</h2>
          </div>
          <button
            type="button"
            className="rawg-filter-drawer__close"
            aria-label="Fermer les filtres"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>
        <FiltersPanelContent onClose={onClose} />
      </aside>
    </>
  )
}

type CatalogSortSelectProps = {
  className?: string
}

export function CatalogSortSelect({ className }: CatalogSortSelectProps) {
  const { filters, setFilter } = useGameFilters()

  return (
    <label className={className ?? 'rawg-catalog__sort'}>
      <span className="sr-only">Trier par</span>
      <select
        className="rawg-catalog__sort-select"
        value={filters.ordering ?? '-rating'}
        disabled={Boolean(filters.search)}
        onChange={(event) => setFilter('ordering', event.target.value)}
        aria-label="Trier par"
      >
        {ORDERING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
