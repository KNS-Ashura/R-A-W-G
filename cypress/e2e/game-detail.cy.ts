const GAME_ID = 56328

describe('Detail jeu RAWG', () => {
  it('affiche la fiche du jeu 56328', () => {
    cy.visit(`/games/${String(GAME_ID)}`)

    cy.get('h1.rawg-detail__section-title', { timeout: 20000 })
      .should('be.visible')
      .and('not.be.empty')

    cy.get('.rawg-detail__description').should('not.be.empty')
    cy.contains('h2', 'Plateformes').should('exist')
    cy.contains('h2', 'Tags').should('exist')
    cy.contains('a', 'Retour au catalogue').should('have.attr', 'href', '/games')
  })
})
