/// <reference types="cypress" />

context('Admin Dashboard', () => {
  beforeEach(() => {
    cy.login()
  })
  it('Displays the user role as "admin" in the user dropdown', () => {
    cy.get('[data-cy=usermenubutton]').click()
    cy.get('[data-cy=usermenu]').should(
      'contain',
      Cypress.env('non_billable_user')
    )
  })
})
