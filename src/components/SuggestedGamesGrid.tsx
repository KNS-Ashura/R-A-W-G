import { Link } from 'react-router-dom'
import type { GameListItem } from '@/services/types'

type SuggestedGamesGridProps = {
  games: GameListItem[]
  currentGameId: number
}

export function SuggestedGamesGrid({
  games,
  currentGameId,
}: SuggestedGamesGridProps) {
  if (games.length === 0) {
    return null
  }

  return (
    <ul className="rawg-related__suggested">
      {games.map((game) => {
        const isCurrent = game.id === currentGameId
        return (
          <li key={game.id}>
            <Link
              to={`/games/${String(game.id)}`}
              className={
                isCurrent
                  ? 'rawg-related__suggested-card rawg-related__card--current'
                  : 'rawg-related__suggested-card'
              }
              aria-current={isCurrent ? 'page' : undefined}
            >
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="rawg-related__img"
                  width={160}
                  height={90}
                  loading="lazy"
                />
              ) : (
                <span className="rawg-related__placeholder">?</span>
              )}
              <span className="rawg-related__name">{game.name}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
