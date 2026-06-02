import { getMetacriticLabel, getMetacriticTone } from '@/lib/metacritic'

type MetacriticBadgeProps = {
  score: number
  size?: 'sm' | 'lg'
  showLabel?: boolean
}

export function MetacriticBadge({
  score,
  size = 'sm',
  showLabel = false,
}: MetacriticBadgeProps) {
  const tone = getMetacriticTone(score)

  return (
    <div
      className={
        size === 'lg'
          ? 'rawg-mc-badge rawg-mc-badge--lg'
          : 'rawg-mc-badge rawg-mc-badge--sm'
      }
    >
      <span
        className={`rawg-mc-badge__score rawg-mc-badge__score--${tone}`}
        aria-label={`Metacritic ${String(score)} sur 100`}
      >
        {score}
      </span>
      {showLabel && (
        <span className="rawg-mc-badge__label">{getMetacriticLabel(score)}</span>
      )}
    </div>
  )
}
