const STAT_LABELS: Record<string, string> = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Défense',
  'special-attack': 'Att. Spé.',
  'special-defense': 'Déf. Spé.',
  speed: 'Vitesse',
}

export function getStatLabel(statName: string): string {
  return STAT_LABELS[statName] ?? statName
}

/** Classe CSS du badge de type (couleurs dans index.css) */
export function getTypeBadgeClass(type: string): string {
  return `type-badge type-${type}`
}

export const MAX_STAT_VALUE = 255
