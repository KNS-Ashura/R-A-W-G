import { Link } from 'react-router-dom'
import type { GameListItem } from '@/api/types'
import { cn } from '@/lib/utils'

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
    <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 p-0">
      {games.map((game) => {
        const isCurrent = game.id === currentGameId
        return (
          <li key={game.id}>
            <Link
              to={`/games/${String(game.id)}`}
              className={cn(
                'flex flex-col overflow-hidden rounded-lg border bg-card transition-colors',
                isCurrent
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50',
              )}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="aspect-video w-full object-cover"
                  width={160}
                  height={90}
                  loading="lazy"
                />
              ) : (
                <span className="flex aspect-video items-center justify-center bg-muted text-xs text-muted-foreground">
                  ?
                </span>
              )}
              <span className="line-clamp-2 p-2 text-xs font-medium">
                {game.name}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
