import { Link } from 'react-router-dom'
import type { RelatedTreeNode } from '@/services/types'

type RelatedGamesTreeProps = {
  root: RelatedTreeNode
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
      className={
        isCurrent
          ? 'rawg-related__card rawg-related__card--current'
          : 'rawg-related__card'
      }
      aria-current={isCurrent ? 'page' : undefined}
    >
      {node.imageUrl ? (
        <img
          src={node.imageUrl}
          alt={node.name}
          className="rawg-related__img"
          width={120}
          height={68}
          loading="lazy"
        />
      ) : (
        <span className="rawg-related__placeholder">?</span>
      )}
      <span className="rawg-related__name">{node.name}</span>
    </Link>
  )
}

function RelatedNode({
  node,
  currentGameId,
}: {
  node: RelatedTreeNode
  currentGameId: number
}) {
  const hasChildren = node.children.length > 0

  return (
    <li className="rawg-related__node">
      <RelatedNodeCard node={node} currentGameId={currentGameId} />
      {hasChildren && (
        <div className="rawg-related__branch">
          <span className="rawg-related__line" aria-hidden />
          <ul className="rawg-related__children">
            {node.children.map((child) => (
              <li key={child.id}>
                <RelatedNode node={child} currentGameId={currentGameId} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

export function RelatedGamesTree({
  root,
  currentGameId,
}: RelatedGamesTreeProps) {
  return (
    <ul className="rawg-related__tree">
      <RelatedNode node={root} currentGameId={currentGameId} />
    </ul>
  )
}
