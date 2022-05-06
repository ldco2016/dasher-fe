/// <reference types="cypress" />

context('Navigation', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Should visit all primary navigation links', () => {
    cy.get('[data-cy=Patients]').click()
    cy.get('[data-cy=headerTitle]').should('contain', 'Patients')

    // cy.get('[data-cy=Billing]').click()
    // cy.get('[data-cy=headerTitle]').should('contain', 'Billing')

    // Disabled for AR-316 until further noticed.
    // cy.get('[data-cy=Clinics]').click()
    // cy.get('[data-cy=headerTitle]').should('contain', 'Clinics')
  })

  it('Should visit user menu links', () => {
    cy.get('[data-cy=usermenubutton]').click()
    cy.get('[data-cy=mySettings]').click()
    // cy.get('[data-cy=usermenubutton]').click({ force: true })
    // cy.get('[data-cy=getSupport]').click()
    // cy.visit('/')
  })
})
