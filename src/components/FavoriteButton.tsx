import { Heart } from 'lucide-react'
import { useFavorites, type FavoriteGame } from '@/context/FavoritesContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FavoriteButtonProps = {
  game: FavoriteGame
  className?: string
}

export function FavoriteButton({ game, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(game.id)
  const label = active
    ? `Retirer ${game.name} des favoris`
    : `Ajouter ${game.name} aux favoris`

  return (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
      size="icon-sm"
      className={cn(
        'shrink-0',
        active && 'bg-primary text-primary-foreground',
        className,
      )}
      aria-label={label}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(game)
      }}
    >
      <Heart
        className={cn('size-4', active && 'fill-current')}
        aria-hidden
      />
    </Button>
  )
}
