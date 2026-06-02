import { Link } from 'react-router-dom'
import type { RelatedTreeNode } from '@/api/types'
import { cn } from '@/lib/utils'

type RelatedGamesTreeProps = {
  root: RelatedTreeNode
  currentGameId: number
}

type RelatedNodeProps = {
  node: RelatedTreeNode
  currentGameId: number
}

function RelatedNodeCard({
  node,
  currentGameId,
}: {
  node: RelatedTreeNode
  currentGameId: number
}) {
  const isCurrent = node.id === currentGameId

  return (
    <Link
      to={`/games/${String(node.id)}`}
      className={cn(
        'flex w-28 flex-col items-center gap-2 rounded-xl border bg-card p-3 transition-colors sm:w-32',
        isCurrent
          ? 'border-primary ring-2 ring-primary/20'
          : 'hover:border-primary/50 hover:bg-muted/30',
      )}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {node.imageUrl ? (
        <img
          src={node.imageUrl}
          alt={node.name}
          className="aspect-video w-full rounded-md object-cover"
          width={120}
          height={68}
          loading="lazy"
        />
      ) : (
        <span className="flex aspect-video w-full items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
          ?
        </span>
      )}
      <span className="line-clamp-2 text-center text-xs font-medium">
        {node.name}
      </span>
    </Link>
  )
}

function RelatedNode({ node, currentGameId }: RelatedNodeProps) {
  const hasChildren = node.children.length > 0

  return (
    <li className="flex flex-col items-center">
      <RelatedNodeCard node={node} currentGameId={currentGameId} />

      {hasChildren && (
        <section
          className="flex flex-col items-center"
          aria-label={`Contenus liés à ${node.name}`}
        >
          <span className="my-2 block h-6 w-px bg-border" aria-hidden />

          <ul className="flex list-none flex-wrap justify-center gap-4 p-0">
            {node.children.map((child) => (
              <li key={child.id}>
                <RelatedNode node={child} currentGameId={currentGameId} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </li>
  )
}

export function RelatedGamesTree({
  root,
  currentGameId,
}: RelatedGamesTreeProps) {
  return (
    <ul className="flex list-none justify-center p-0">
      <RelatedNode node={root} currentGameId={currentGameId} />
    </ul>
  )
}
