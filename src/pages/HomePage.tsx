import { GamesCatalog } from '@/components/GamesCatalog'
import { TrendingHeader } from '@/components/layout/TrendingHeader'

export function HomePage() {
  return (
    <div className="rawg-home">
      <TrendingHeader />
      <div className="rawg-home__body">
        <header className="rawg-home__intro">
          <span className="rawg-home__intro-badge">Catalogue</span>
          <h2 className="rawg-home__intro-title">Explorer les jeux</h2>
          <p className="rawg-home__intro-text">
            Parcours le catalogue, filtre par plateforme ou store, et trouve ta
            prochaine aventure.
          </p>
        </header>
        <GamesCatalog showPageHeader={false} />
      </div>
    </div>
  )
}
