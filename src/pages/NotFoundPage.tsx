import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="space-y-4 text-center sm:text-left">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="text-muted-foreground">Cette page n’existe pas.</p>
      <Link
        to="/games"
        className="inline-block font-medium text-primary underline-offset-4 hover:underline"
      >
        Retour à la liste
      </Link>
    </section>
  )
}
