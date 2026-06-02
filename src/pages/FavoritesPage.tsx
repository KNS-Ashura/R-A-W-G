import { Link } from 'react-router-dom'
import { HeartOff } from 'lucide-react'
import { FavoriteButton } from '@/components/FavoriteButton'
import { buttonVariants } from '@/components/ui/button'
import { useFavorites } from '@/context/FavoritesContext'
import { cn } from '@/lib/utils'

export function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <section className="rawg-favorites">
      <header className="rawg-favorites__header">
        <h1 className="rawg-favorites__title">Favoris</h1>
        <p className="rawg-games__subtitle">
          {favorites.length === 0
            ? 'Aucun jeu en favori.'
            : `${String(favorites.length)} jeu${favorites.length > 1 ? 'x' : ''} favori${favorites.length > 1 ? 's' : ''}`}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="rawg-favorites__empty" role="status">
          <HeartOff
            className="mx-auto mb-3 size-10 text-muted-foreground"
            aria-hidden
          />
          <p className="rawg-favorites__empty-text">
            Parcourez le catalogue et ajoutez des jeux a vos favoris.
          </p>
          <Link
            to="/games"
            className={cn(buttonVariants({ variant: 'default' }), 'mt-4 inline-flex')}
          >
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <ul className="rawg-games__grid">
          {favorites.map((game) => (
            <li key={game.id}>
              <article className="rawg-game-card">
                <div className="rawg-favorite-btn-wrap">
                  <FavoriteButton game={game} />
                </div>
                <Link
                  to={`/games/${String(game.id)}`}
                  className="rawg-game-card__link"
                >
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="rawg-game-card__image"
                      width={160}
                      height={90}
                      loading="lazy"
                    />
                  ) : (
                    <div className="rawg-game-card__placeholder">
                      Pas d&apos;image
                    </div>
                  )}
                  <div className="rawg-game-card__body">
                    <span className="rawg-game-card__name">{game.name}</span>
                    <span className="rawg-game-card__meta">#{game.id}</span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
