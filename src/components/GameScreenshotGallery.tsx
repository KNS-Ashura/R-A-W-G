import { useState } from 'react'
import type { GameDetail } from '@/services/types'

const INITIAL_VISIBLE = 6

type GameScreenshotGalleryProps = {
  gameName: string
  screenshots: GameDetail['screenshots']
  totalCount?: number
}

export function GameScreenshotGallery({
  gameName,
  screenshots,
  totalCount,
}: GameScreenshotGalleryProps) {
  const [showAll, setShowAll] = useState(false)

  if (screenshots.length === 0) {
    return null
  }

  const visible = showAll ? screenshots : screenshots.slice(0, INITIAL_VISIBLE)
  const hasMore = screenshots.length > INITIAL_VISIBLE

  return (
    <section className="rawg-detail__panel rawg-detail__gallery-section">
      <div className="rawg-detail__gallery-header">
              <h2 className="rawg-detail__panel-title">Captures d&apos;ecran</h2>
        {totalCount !== undefined && totalCount > 0 && (
          <span className="rawg-detail__gallery-count">
            {String(visible.length)} affichee{visible.length > 1 ? 's' : ''}
            {totalCount > visible.length ? ` sur ${String(totalCount)}` : ''}
          </span>
        )}
      </div>
      <ul className="rawg-detail__gallery">
        {visible.map((shot, index) => (
          <li key={shot.id} className="rawg-detail__gallery-item">
            <a
              href={shot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rawg-detail__gallery-link"
            >
              <img
                src={shot.url}
                alt={`Capture ${String(index + 1)} — ${gameName}`}
                className="rawg-detail__gallery-img"
                width={320}
                height={180}
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
      {hasMore && !showAll && (
        <button
          type="button"
          className="rawg-detail__gallery-more"
          onClick={() => setShowAll(true)}
        >
          Voir toutes les captures ({String(screenshots.length)})
        </button>
      )}
    </section>
  )
}
