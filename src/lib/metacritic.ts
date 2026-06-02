export type MetacriticTone = 'high' | 'mid' | 'low'

export function getMetacriticTone(score: number): MetacriticTone {
  if (score >= 75) {
    return 'high'
  }
  if (score >= 50) {
    return 'mid'
  }
  return 'low'
}

export function getMetacriticLabel(score: number): string {
  const tone = getMetacriticTone(score)
  if (tone === 'high') {
    return 'Acclamé'
  }
  if (tone === 'mid') {
    return 'Mitigé'
  }
  return 'Décevant'
}
