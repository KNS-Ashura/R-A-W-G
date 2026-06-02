import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GameCard } from '@/components/GameCard'
import { usePublisher, usePublisherGames } from '@/hooks/usePublisherPage'
import { GAMES_PAGE_SIZE } from '@/hooks/useGamesCatalog'

export function PublisherPage() {
  const { id } = useParams<{ id: string }>()
  const [page, setPage] = useState(1)

  const publisherQuery = usePublisher(id)
  const gamesQuery = usePublisherGames(id, page)

  if (!id) {
    return (
      <p className="rawg-games__status rawg-games__status--error" role="alert">
        Identifiant editeur manquant.
      </p>
    )
  }

  if (publisherQuery.isLoading || gamesQuery.isLoading) {
    return (
      <p className="rawg-games__status" role="status">
        Chargement...
      </p>
    )
  }

  if (publisherQuery.isError || gamesQuery.isError) {
    return (
      <p className="rawg-games__status rawg-games__status--error" role="alert">
        Impossible de charger l&apos;editeur.
      </p>
    )
  }

  const publisher = publisherQuery.data
  const games = gamesQuery.data

  if (!publisher || !games) {
    return null
  }

  const totalPages = Math.max(1, Math.ceil(games.total / GAMES_PAGE_SIZE))

  return (
    <section className="rawg-games">
      <header className="rawg-games__header">
        <h1 className="rawg-games__title">{publisher.name}</h1>
        <p className="rawg-games__subtitle">
          {publisher.games_count} jeu{publisher.games_count > 1 ? 'x' : ''} publie
          {publisher.games_count > 1 ? 's' : ''}
        </p>
      </header>

      {games.items.length === 0 ? (
        <p className="rawg-games__status" role="status">
          Aucun jeu pour cet editeur.
        </p>
      ) : (
        <ul className="rawg-games__grid">
          {games.items.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}

      <nav
        className="rawg-games__load-more"
        aria-label="Pagination editeur"
      >
        <button
          type="button"
          className="rawg-games__load-btn"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Precedent
        </button>
        <span className="rawg-games__subtitle">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          className="rawg-games__load-btn"
          disabled={!games.hasMore}
          onClick={() => setPage((current) => current + 1)}
        >
          Suivant
        </button>
      </nav>

      <p className="rawg-games__subtitle">
        <Link to="/games" className="rawg-detail__company-link">
          Retour au catalogue
        </Link>
      </p>
    </section>
  )
}
