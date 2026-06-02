import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Clock, Star } from 'lucide-react'
import { FavoriteButton } from '@/components/FavoriteButton'
import { HeroBackground } from '@/components/HeroBackground'
import { GameRequirementsPanel } from '@/components/GameRequirementsPanel'
import { GameScreenshotGallery } from '@/components/GameScreenshotGallery'
import { MetacriticBadge } from '@/components/MetacriticBadge'
import { RelatedGamesTree } from '@/components/RelatedGamesTree'
import { SuggestedGamesGrid } from '@/components/SuggestedGamesGrid'
import { countRelatedNodes } from '@/services/games.mapper'
import { ApiError } from '@/services/http'
import type { GameDetail } from '@/services/types'
import { useGameDetail } from '@/hooks/useGameDetail'
import { formatReleaseDate } from '@/lib/gameLabels'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DESCRIPTION_PREVIEW = 520
const TAGS_PREVIEW = 12

function AchievementBar({
  name,
  description,
  percent,
}: {
  name: string
  description: string
  percent: number
}) {
  return (
    <article className="rawg-achievement">
      <div className="rawg-achievement__header">
        <span className="rawg-achievement__name">{name}</span>
        <span className="rawg-achievement__percent">{percent.toFixed(1)} %</span>
      </div>
      <progress
        className="rawg-achievement__progress"
        value={Math.min(100, percent)}
        max={100}
        aria-label={`Progression ${name}`}
      />
      {description && <p className="rawg-achievement__desc">{description}</p>}
    </article>
  )
}

function GameDetailView({ game }: { game: GameDetail }) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [tagsExpanded, setTagsExpanded] = useState(false)

  const hasDlcTree =
    game.additionsTree !== null && countRelatedNodes(game.additionsTree) > 1
  const hasUniverseList = game.universeGames.length > 0
  const treeNodeCount = game.additionsTree
    ? countRelatedNodes(game.additionsTree)
    : 0
  const showUniverseGrid =
    hasUniverseList &&
    (!hasDlcTree || game.universeGames.length > treeNodeCount)
  const hasDlc = hasDlcTree || hasUniverseList
  const hasSuggested = game.suggestedGames.length > 0

  const heroImage = game.heroImageUrl ?? game.imageUrl
  const descriptionLong = game.description.length > DESCRIPTION_PREVIEW
  const visibleDescription =
    descriptionExpanded || !descriptionLong
      ? game.description
      : `${game.description.slice(0, DESCRIPTION_PREVIEW).trim()}…`
  const visibleTags = tagsExpanded ? game.tags : game.tags.slice(0, TAGS_PREVIEW)

  return (
    <article className="rawg-detail">
      <header className="rawg-detail__hero">
        {heroImage && <HeroBackground imageUrl={heroImage} />}
        <div className="rawg-detail__hero-overlay" />
        <div className="rawg-detail__hero-inner">
          <Link
            to="/games"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'rawg-detail__back',
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Retour au catalogue
          </Link>
          <div className="rawg-detail__hero-content">
            {game.genres.length > 0 && (
              <p className="rawg-detail__hero-genres">
                {game.genres.join(' · ')}
              </p>
            )}
            <h1 className="rawg-detail__hero-title">{game.name}</h1>
          </div>
        </div>
      </header>

      <div className="rawg-detail__body">
        <div className="rawg-detail__layout">
          <div className="rawg-detail__main">
            <section className="rawg-detail__panel">
              <h2 className="rawg-detail__panel-title">A propos</h2>
              <p className="rawg-detail__description">{visibleDescription}</p>
              {descriptionLong && (
                <button
                  type="button"
                  className="rawg-detail__expand-btn"
                  onClick={() => setDescriptionExpanded((value) => !value)}
                >
                  {descriptionExpanded ? 'Reduire' : 'Lire la suite'}
                </button>
              )}
            </section>

            <GameScreenshotGallery
              gameName={game.name}
              screenshots={game.screenshots}
              totalCount={game.screenshotsTotal}
            />

            {game.trailerUrl && (
              <section className="rawg-detail__panel">
                <h2 className="rawg-detail__panel-title">Trailer</h2>
                <video
                  className="rawg-detail__trailer"
                  src={game.trailerUrl}
                  controls
                  preload="metadata"
                  poster={heroImage ?? undefined}
                >
                  Votre navigateur ne prend pas en charge la video.
                </video>
              </section>
            )}

            {game.pcRequirements && (
              <GameRequirementsPanel requirements={game.pcRequirements} />
            )}

            {game.metacriticPlatforms.length > 0 && (
              <section className="rawg-detail__panel">
                <h2 className="rawg-detail__panel-title">
                  Metacritic par plateforme
                </h2>
                <ul className="rawg-detail__mc-list">
                  {game.metacriticPlatforms.map((entry) => (
                    <li key={entry.platform} className="rawg-detail__mc-item">
                      {entry.url ? (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rawg-detail__mc-link"
                        >
                          <span>{entry.platform}</span>
                          <MetacriticBadge score={entry.score} />
                        </a>
                      ) : (
                        <>
                          <span>{entry.platform}</span>
                          <MetacriticBadge score={entry.score} />
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(hasDlc || hasSuggested) && (
              <section className="rawg-detail__panel">
                <h2 className="rawg-detail__panel-title">Univers du jeu</h2>
                {hasDlc && (
                  <div className="rawg-detail__related-block">
                    <h3 className="rawg-detail__related-title">
                      Jeu principal et extensions
                    </h3>
                    {hasDlcTree && game.additionsTree && (
                      <div className="rawg-detail__related-scroll">
                        <RelatedGamesTree
                          root={game.additionsTree}
                          currentGameId={game.id}
                        />
                      </div>
                    )}
                    {showUniverseGrid && (
                      <SuggestedGamesGrid
                        games={game.universeGames}
                        currentGameId={game.id}
                      />
                    )}
                  </div>
                )}
                {hasDlc && hasSuggested && (
                  <hr className="rawg-detail__related-divider" />
                )}
                {hasSuggested && (
                  <div className="rawg-detail__related-block">
                    <h3 className="rawg-detail__related-title">
                      Jeux similaires
                    </h3>
                    <SuggestedGamesGrid
                      games={game.suggestedGames}
                      currentGameId={game.id}
                    />
                  </div>
                )}
              </section>
            )}

            {game.achievements.length > 0 && (
              <section className="rawg-detail__panel">
                <h2 className="rawg-detail__panel-title">Achievements</h2>
                {game.achievements.map((achievement) => (
                  <AchievementBar
                    key={achievement.id}
                    name={achievement.name}
                    description={achievement.description}
                    percent={achievement.percent}
                  />
                ))}
              </section>
            )}
          </div>

          <aside className="rawg-detail__aside">
            <div className="rawg-detail__buy-card">
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="rawg-detail__cover"
                  width={320}
                  height={180}
                />
              ) : (
                <div className="rawg-detail__cover rawg-detail__cover--empty">
                  Pas d&apos;image
                </div>
              )}

              <div className="rawg-detail__scores">
                <div className="rawg-detail__score-box">
                  <span className="rawg-detail__score-label">
                    <Star className="size-3.5" aria-hidden />
                    Note RAWG
                  </span>
                  <span className="rawg-detail__score-value">
                    {game.rating.toFixed(1)}
                    <small>/5</small>
                  </span>
                  <span className="rawg-detail__score-meta">
                    {game.ratingsCount.toLocaleString('fr-FR')} avis
                  </span>
                </div>
                {game.metacritic !== null && (
                  <div className="rawg-detail__score-box rawg-detail__score-box--mc">
                    <span className="rawg-detail__score-label">Metacritic</span>
                    <MetacriticBadge
                      score={game.metacritic}
                      size="lg"
                      showLabel
                    />
                  </div>
                )}
              </div>

              <div className="rawg-detail__favorite-wrap">
                <FavoriteButton
                  game={{
                    id: game.id,
                    name: game.name,
                    imageUrl: game.imageUrl,
                  }}
                />
              </div>

              <dl className="rawg-detail__meta">
                <div className="rawg-detail__meta-row">
                  <dt>Sortie</dt>
                  <dd>{formatReleaseDate(game.released)}</dd>
                </div>
                <div className="rawg-detail__meta-row">
                  <dt>
                    <Clock className="size-3.5" aria-hidden />
                    Duree moyenne
                  </dt>
                  <dd>{game.playtime} h</dd>
                </div>
                {game.esrbRating && (
                  <div className="rawg-detail__meta-row">
                    <dt>Classification</dt>
                    <dd>{game.esrbRating}</dd>
                  </div>
                )}
              </dl>

              {game.platforms.length > 0 && (
                <div className="rawg-detail__aside-block rawg-detail__aside-block--platforms">
                  <h3 className="rawg-detail__aside-title">Plateformes</h3>
                  <div className="rawg-detail__tags">
                    {game.platforms.map((platform) => (
                      <span key={platform} className="rawg-detail__tag">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(game.developers.length > 0 || game.publishers.length > 0) && (
                <div className="rawg-detail__aside-block rawg-detail__aside-block--studios">
                  <h3 className="rawg-detail__aside-title">Studios</h3>
                  <ul className="rawg-detail__companies">
                    {game.developers.map((studio) => (
                      <li key={`dev-${String(studio.id)}`}>
                        Dev. {studio.name}
                      </li>
                    ))}
                    {game.publishers.map((publisher) => (
                      <li key={`pub-${String(publisher.id)}`}>
                        Ed.{' '}
                        <Link
                          to={`/publisher/${String(publisher.id)}`}
                          className="rawg-detail__company-link"
                        >
                          {publisher.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {game.tags.length > 0 && (
                <div className="rawg-detail__aside-block rawg-detail__aside-block--tags">
                  <h3 className="rawg-detail__aside-title">Tags</h3>
                  <div className="rawg-detail__tags rawg-detail__tags--compact">
                    {visibleTags.map((tag) => (
                      <span key={tag} className="rawg-detail__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {game.tags.length > TAGS_PREVIEW && (
                    <button
                      type="button"
                      className="rawg-detail__expand-btn"
                      onClick={() => setTagsExpanded((value) => !value)}
                    >
                      {tagsExpanded
                        ? 'Moins de tags'
                        : `+ ${String(game.tags.length - TAGS_PREVIEW)} tags`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: game, isLoading, isError, error } = useGameDetail(id)

  if (!id) {
    return (
      <Alert>
        <AlertCircle />
        <AlertTitle>Parametre manquant</AlertTitle>
        <AlertDescription>
          Aucun identifiant de jeu n&apos;a ete fourni.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <p className="rawg-games__status rawg-detail__loading" role="status">
        Chargement du jeu...
      </p>
    )
  }

  if (isError) {
    const isNotFound = error instanceof ApiError && error.status === 404
    return (
      <div className="rawg-detail__error">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>
            {isNotFound ? 'Jeu introuvable' : 'Erreur de chargement'}
          </AlertTitle>
          <AlertDescription>
            {isNotFound
              ? `Aucun jeu ne correspond a l'identifiant ${id}.`
              : 'Impossible de charger les donnees.'}
          </AlertDescription>
        </Alert>
        <Link
          to="/"
          className={cn(buttonVariants({ variant: 'outline' }), 'rawg-detail__back')}
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    )
  }

  if (!game) {
    return null
  }

  return <GameDetailView game={game} />
}
