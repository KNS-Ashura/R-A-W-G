import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroBackground } from '@/components/HeroBackground'
import { useTrendingHero } from '@/hooks/useTrendingHero'
import { formatReleaseDate } from '@/lib/gameLabels'

type HeroGame = {
  id: number
  name: string
  imageUrl: string | null
  heroImageUrl: string
  genres: string[]
  rating: number
  released: string | null
}

function HeroContent({ game }: { game: HeroGame }) {
  return (
    <>
      <span className="rawg-hero__badge">Tendances du moment</span>
      <h1 className="rawg-hero__title">{game.name}</h1>
      <p className="rawg-hero__meta">
        <span>Note {game.rating.toFixed(1)}</span>
        <span>Sortie {formatReleaseDate(game.released)}</span>
      </p>
      {game.genres.length > 0 && (
        <div className="rawg-hero__genres">
          {game.genres.slice(0, 4).map((genre) => (
            <span key={genre} className="rawg-hero__genre">
              {genre}
            </span>
          ))}
        </div>
      )}
      <div className="rawg-hero__actions">
        <Link
          to={`/games/${String(game.id)}`}
          className="rawg-hero__cta"
        >
          Voir la fiche
        </Link>
        <Link to="/games" className="rawg-hero__cta-secondary">
          Tout le catalogue
        </Link>
      </div>
    </>
  )
}

const ROTATION_MS = 8000

export function TrendingHeader() {
  const { data: games, isLoading, isError } = useTrendingHero()
  const [activeIndex, setActiveIndex] = useState(0)

  const slideCount = games?.length ?? 0
  const activeGame = games?.[activeIndex]

  const goToSlide = useCallback(
    (index: number) => {
      if (slideCount === 0) {
        return
      }
      setActiveIndex(index % slideCount)
    },
    [slideCount],
  )

  useEffect(() => {
    if (slideCount <= 1) {
      return
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, ROTATION_MS)

    return () => window.clearInterval(timer)
  }, [slideCount])

  useEffect(() => {
    if (activeIndex >= slideCount && slideCount > 0) {
      setActiveIndex(0)
    }
  }, [activeIndex, slideCount])

  if (isLoading) {
    return (
      <header className="rawg-hero" aria-busy="true">
        <div className="rawg-hero__skeleton" role="status">
          <span className="sr-only">Chargement des tendances...</span>
        </div>
      </header>
    )
  }

  if (isError || !games || games.length === 0 || !activeGame) {
    return (
      <header className="rawg-hero">
        <div className="rawg-hero__overlay" />
        <div className="rawg-hero__content">
          <span className="rawg-hero__badge">RAWG</span>
          <h1 className="rawg-hero__title">Catalogue jeux video</h1>
          <div className="rawg-hero__actions">
            <Link to="/games" className="rawg-hero__cta">
              Explorer les jeux
            </Link>
          </div>
        </div>
        <div className="rawg-hero__clip" aria-hidden />
      </header>
    )
  }

  return (
    <header className="rawg-hero">
      <div className="rawg-hero__slides" aria-hidden>
        {games.map((game, index) => (
          <div
            key={game.id}
            className={
              index === activeIndex
                ? 'rawg-hero__slide rawg-hero__slide--active'
                : 'rawg-hero__slide'
            }
          >
            {game.heroImageUrl && <HeroBackground imageUrl={game.heroImageUrl} />}
          </div>
        ))}
      </div>

      <div className="rawg-hero__overlay" />
      <div className="rawg-hero__overlay-accent" />

      <div className="rawg-hero__content">
        <HeroContent game={activeGame} />
      </div>

      {slideCount > 1 && (
        <nav className="rawg-hero__controls" aria-label="Slides tendances">
          {games.map((game, index) => (
            <button
              key={game.id}
              type="button"
              className={
                index === activeIndex
                  ? 'rawg-hero__dot rawg-hero__dot--active'
                  : 'rawg-hero__dot'
              }
              aria-label={`Afficher ${game.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => goToSlide(index)}
            />
          ))}
        </nav>
      )}

      <div className="rawg-hero__clip" aria-hidden />
    </header>
  )
}
