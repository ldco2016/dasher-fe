/// <reference types="cypress" />

context('Patient Graph', () => {
  it('Basic Login page', () => {
    cy.visit('/auth/signin')

    cy.get('body').should('exist')
    cy.get('[name=email]').should('exist')
  })

  it('Session Expired Message shows through query parameter', () => {
    cy.visit('/auth/signin?reason=expired')
    cy.get('body').should('exist')
    cy.get('div[role=alert]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Session Expired')
  })
})
