import { ArrowLeft, AlertCircle, Calendar, Clock, Star } from 'lucide-react'
import { FavoriteButton } from '@/components/FavoriteButton'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { countRelatedNodes } from '@/api/games.mapper'
import type { GameDetail } from '@/api/types'
import { RelatedGamesTree } from '@/components/RelatedGamesTree'
import { SuggestedGamesGrid } from '@/components/SuggestedGamesGrid'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGameDetail } from '@/hooks/useGameDetail'
import {
  formatReleaseDate,
  getGenreBadgeClass,
  getRatingLabel,
  MAX_RATING_STAT_VALUE,
} from '@/lib/gameLabels'
import { cn } from '@/lib/utils'

function GameDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-32" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function GameDetailContent({ game }: { game: GameDetail }) {
  const maxStat = Math.max(
    ...game.ratingStats.map((s) => s.value),
    MAX_RATING_STAT_VALUE,
  )
  const hasAdditions =
    game.additionsTree && countRelatedNodes(game.additionsTree) > 1
  const hasSuggested = game.suggestedGames.length > 0

  return (
    <div className="space-y-6">
      <Link
        to="/games"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          '-ml-2 inline-flex w-fit items-center gap-1.5',
        )}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour au catalogue
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            {game.imageUrl ? (
              <img
                src={game.imageUrl}
                alt={game.name}
                className="aspect-video w-full rounded-xl object-cover"
                width={320}
                height={180}
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
                Pas d&apos;image
              </div>
            )}
            <div className="flex w-full items-start justify-center gap-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {game.name}
                </h1>
                <p className="text-sm text-muted-foreground">#{game.id}</p>
              </div>
              <FavoriteButton
                game={{
                  id: game.id,
                  name: game.name,
                  imageUrl: game.imageUrl,
                }}
                className="mt-1 shrink-0"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {game.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className={cn('genre-badge', getGenreBadgeClass(genre.toLowerCase().replace(/\s+/g, '-')))}
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <Separator className="w-full" />
            <dl className="grid w-full grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Star className="size-4 text-muted-foreground" aria-hidden />
                <div className="text-left">
                  <dt className="text-muted-foreground">Note</dt>
                  <dd className="font-medium">
                    {game.rating.toFixed(1)} ({game.ratingsCount} avis)
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Calendar className="size-4 text-muted-foreground" aria-hidden />
                <div className="text-left">
                  <dt className="text-muted-foreground">Sortie</dt>
                  <dd className="font-medium">
                    {formatReleaseDate(game.released)}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Clock className="size-4 text-muted-foreground" aria-hidden />
                <div className="text-left">
                  <dt className="text-muted-foreground">Durée moy.</dt>
                  <dd className="font-medium">{game.playtime} h</dd>
                </div>
              </div>
              {game.metacritic !== null && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <span
                    className="flex size-4 items-center justify-center text-xs font-bold text-muted-foreground"
                    aria-hidden
                  >
                    M
                  </span>
                  <div className="text-left">
                    <dt className="text-muted-foreground">Metacritic</dt>
                    <dd className="font-medium">{game.metacritic}</dd>
                  </div>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Résumé du jeu</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {game.description}
              </p>
            </CardContent>
          </Card>

          {game.ratingStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Répartition des notes</CardTitle>
                <CardDescription>
                  Total :{' '}
                  <span className="font-medium text-foreground">
                    {game.ratingStatsTotal}
                  </span>{' '}
                  avis détaillés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {game.ratingStats.map((stat) => (
                  <Progress
                    key={stat.name}
                    value={Math.round((stat.value / maxStat) * 100)}
                  >
                    <ProgressLabel>
                      {getRatingLabel(stat.name)} — {stat.value}
                    </ProgressLabel>
                    <ProgressValue />
                  </Progress>
                ))}
              </CardContent>
            </Card>
          )}

          {(hasAdditions || hasSuggested) && (
            <Card>
              <CardHeader>
                <CardTitle>Univers du jeu</CardTitle>
                <CardDescription>
                  DLC, extensions et jeux proches de cette licence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {hasAdditions && game.additionsTree && (
                  <section aria-labelledby="additions-heading">
                    <h3
                      id="additions-heading"
                      className="mb-4 text-sm font-semibold text-foreground"
                    >
                      DLC & extensions
                    </h3>
                    <div className="overflow-x-auto pb-2">
                      <RelatedGamesTree
                        root={game.additionsTree}
                        currentGameId={game.id}
                      />
                    </div>
                  </section>
                )}

                {hasAdditions && hasSuggested && <Separator />}

                {hasSuggested && (
                  <section aria-labelledby="suggested-heading">
                    <h3
                      id="suggested-heading"
                      className="mb-4 text-sm font-semibold text-foreground"
                    >
                      Jeux similaires
                    </h3>
                    <SuggestedGamesGrid
                      games={game.suggestedGames}
                      currentGameId={game.id}
                    />
                  </section>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export function GameDetailPage() {
  const { identifier } = useParams<{ identifier: string }>()
  const { data: game, isLoading, isError, error } = useGameDetail(identifier)

  if (!identifier) {
    return (
      <Alert>
        <AlertCircle />
        <AlertTitle>Paramètre manquant</AlertTitle>
        <AlertDescription>
          Aucun identifiant de jeu n&apos;a été fourni dans l&apos;URL.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return <GameDetailSkeleton />
  }

  if (isError) {
    const isNotFound =
      error instanceof ApiError && error.status === 404
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>
            {isNotFound ? 'Jeu introuvable' : 'Erreur de chargement'}
          </AlertTitle>
          <AlertDescription>
            {isNotFound
              ? `Aucun jeu ne correspond à « ${identifier} ».`
              : 'Impossible de charger les données. Réessayez plus tard.'}
          </AlertDescription>
        </Alert>
        <Link
          to="/games"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'inline-flex items-center gap-1.5',
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour à la liste
        </Link>
      </div>
    )
  }

  if (!game) {
    return null
  }

  return <GameDetailContent game={game} />
}
