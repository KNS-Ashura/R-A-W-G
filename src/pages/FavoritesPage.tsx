import { Link } from 'react-router-dom'
import { HeartOff } from 'lucide-react'
import { FavoriteButton } from '@/components/FavoriteButton'
import { buttonVariants } from '@/components/ui/button'
import { useFavorites } from '@/context/FavoritesContext'
import { cn } from '@/lib/utils'

export function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Favoris</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {favorites.length === 0
            ? 'Aucun jeu en favori pour le moment.'
            : `${String(favorites.length)} jeu${favorites.length > 1 ? 'x' : ''} favori${favorites.length > 1 ? 's' : ''}`}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div
          className="rounded-default border border-dashed border-border bg-muted/30 p-8 text-center"
          role="status"
        >
          <HeartOff
            className="mx-auto mb-3 size-10 text-muted-foreground"
            aria-hidden
          />
          <p className="text-muted-foreground">
            Parcourez le catalogue et cliquez sur le cœur pour enregistrer vos
            jeux préférés.
          </p>
          <Link
            to="/games"
            className={cn(buttonVariants({ variant: 'default' }), 'mt-4 inline-flex')}
          >
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-0">
          {favorites.map((game) => (
            <li key={game.id}>
              <article className="relative overflow-hidden rounded-default border border-border bg-card text-card-foreground transition-colors hover:border-primary hover:shadow-md hover:shadow-primary/10">
                <FavoriteButton
                  game={game}
                  className="absolute top-2 right-2 z-10"
                />
                <Link
                  to={`/games/${String(game.id)}`}
                  className="flex flex-col items-center p-4 pt-10 no-underline"
                >
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="aspect-video w-full rounded-md object-cover"
                      width={160}
                      height={90}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex aspect-video w-full items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
                      aria-hidden
                    >
                      ?
                    </div>
                  )}
                  <span className="mt-2 line-clamp-2 text-center font-semibold">
                    {game.name}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    #{game.id}
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
