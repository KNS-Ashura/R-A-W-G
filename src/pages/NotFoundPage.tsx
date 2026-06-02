import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="rawg-not-found">
      <h1 className="rawg-not-found__title">Page introuvable (404)</h1>
      <p className="rawg-not-found__text">
        La page demandee n&apos;existe pas ou a ete deplacee.
      </p>
      <Link to="/" className="rawg-not-found__link">
        Retour a l&apos;accueil
      </Link>
    </section>
  )
}
