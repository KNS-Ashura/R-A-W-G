import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { FavoriteButton } from '@/components/FavoriteButton'
import { getMetacriticTone } from '@/lib/metacritic'
import { formatReleaseDate } from '@/lib/gameLabels'
import type { GameListItem } from '@/services/types'

type GameCardProps = {
  game: GameListItem
}

export function GameCard({ game }: GameCardProps) {
  const mcTone = game.metacritic !== null ? getMetacriticTone(game.metacritic) : null

  return (
    <li>
      <article className="rawg-game-card">
        <div className="rawg-favorite-btn-wrap">
          <FavoriteButton
            game={{
              id: game.id,
              name: game.name,
              imageUrl: game.imageUrl,
            }}
          />
        </div>
        <Link to={`/games/${String(game.id)}`} className="rawg-game-card__link">
          <div className="rawg-game-card__media">
            {game.imageUrl ? (
              <img
                src={game.imageUrl}
                alt={game.name}
                className="rawg-game-card__image"
                width={320}
                height={180}
                loading="lazy"
              />
            ) : (
              <div className="rawg-game-card__placeholder">Pas d&apos;image</div>
            )}
            <div className="rawg-game-card__badges">
              <span className="rawg-game-card__rating">
                <Star className="size-3" aria-hidden />
                {game.rating.toFixed(1)}
              </span>
              {game.metacritic !== null && mcTone && (
                <span
                  className={`rawg-game-card__mc rawg-game-card__mc--${mcTone}`}
                >
                  {game.metacritic}
                </span>
              )}
            </div>
          </div>
          <div className="rawg-game-card__body">
            <span className="rawg-game-card__name">{game.name}</span>
            <span className="rawg-game-card__meta">
              {formatReleaseDate(game.released)}
            </span>
            {game.genres.length > 0 && (
              <div className="rawg-game-card__genres">
                {game.genres.slice(0, 2).map((genre) => (
                  <span key={genre} className="rawg-game-card__genre">
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </article>
    </li>
  )
}

export function GameCardSkeleton() {
  return (
    <li>
      <article className="rawg-game-card rawg-game-card--skeleton" aria-hidden>
        <div className="rawg-game-card__media rawg-game-card__shimmer" />
        <div className="rawg-game-card__body">
          <span className="rawg-game-card__shimmer rawg-game-card__shimmer--title" />
          <span className="rawg-game-card__shimmer rawg-game-card__shimmer--meta" />
        </div>
      </article>
    </li>
  )
}
