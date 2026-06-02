import { GamesCatalog } from '@/components/GamesCatalog'

export function GameListPage() {
  return (
    <div className="rawg-catalog-page">
      <header className="rawg-catalog-page__hero">
        <div className="rawg-catalog-page__hero-inner">
          <span className="rawg-catalog-page__badge">RAWG</span>
          <h1 className="rawg-catalog-page__title">Catalogue des jeux</h1>
          <p className="rawg-catalog-page__subtitle">
            Des milliers de titres a explorer — filtres, tri et scroll infini.
          </p>
        </div>
      </header>
      <div className="rawg-catalog-page__content">
        <GamesCatalog showPageHeader={false} />
      </div>
    </div>
  )
}
