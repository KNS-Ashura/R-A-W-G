import { useState } from 'react'
import type { GameRequirements } from '@/services/types'

type GameRequirementsPanelProps = {
  requirements: GameRequirements
}

export function GameRequirementsPanel({
  requirements,
}: GameRequirementsPanelProps) {
  const [activeTab, setActiveTab] = useState<'minimum' | 'recommended'>(
    requirements.minimum ? 'minimum' : 'recommended',
  )

  const tabs = [
    { id: 'minimum' as const, label: 'Minimum', content: requirements.minimum },
    {
      id: 'recommended' as const,
      label: 'Recommande',
      content: requirements.recommended,
    },
  ].filter((tab) => tab.content)

  if (tabs.length === 0) {
    return null
  }

  const activeContent =
    tabs.find((tab) => tab.id === activeTab)?.content ?? tabs[0]?.content

  return (
    <section className="rawg-detail__panel">
      <h2 className="rawg-detail__panel-title">Configuration requise (PC)</h2>
      {tabs.length > 1 && (
        <div className="rawg-detail__req-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={
                activeTab === tab.id
                  ? 'rawg-detail__req-tab rawg-detail__req-tab--active'
                  : 'rawg-detail__req-tab'
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <pre className="rawg-detail__req-content">{activeContent}</pre>
    </section>
  )
}
