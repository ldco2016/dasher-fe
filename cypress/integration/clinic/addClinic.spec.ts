/// <reference types="cypress" />

// Clinic Menu item has been temp. removed.
context.skip('Add Clinic', () => {
  beforeEach(() => {
    cy.login()
    // Clinics api load time has increased dramatically so increase the timeout for now
    Cypress.config('defaultCommandTimeout', 20000)
    cy.get('[data-cy=Clinics]').click()
  })
  it('ein validation works', () => {
    cy.get('[data-cy=add-clinic]').click()

    cy.get('[data-cy=create-clinic-drawer-form]')
      .should('exist')
      .should('be.visible')

    const einField =
      '[data-cy=ein] > .MuiOutlinedInput-root > input.MuiOutlinedInput-input'
    const einFieldValidation = '[data-cy=ein] > p'

    cy.get(einField).should('exist').should('be.visible')
    cy.get(einFieldValidation).should('not.exist')

    cy.get(einField).type('wrong')
    cy.get(einFieldValidation).should('exist').should('be.visible')
    cy.get(einField).clear()
    cy.get(einFieldValidation).should('exist')

    cy.get(einField).type('123456789')
    cy.get(einFieldValidation).should('not.exist')

    cy.get(einField).clear().type('1234d6789')
    cy.get(einFieldValidation).should('exist')
  })
  it('NPI validation works', () => {
    cy.get('[data-cy=add-clinic]').click()

    cy.get('[data-cy=create-clinic-drawer-form]')
      .should('exist')
      .should('be.visible')

    const npiField =
      '[data-cy=adminNpi] > .MuiOutlinedInput-root > input.MuiOutlinedInput-input'
    const npiFieldValidation = '[data-cy=adminNpi] > p'

    cy.get(npiField).should('exist').should('be.visible')
    cy.get(npiFieldValidation).should('not.exist')

    cy.get(npiField).type('wrong')
    cy.get(npiFieldValidation).should('exist').should('be.visible')
    cy.get(npiField).clear()

    cy.get(npiField).type('1234567890')
    cy.get(npiFieldValidation).should('not.exist')

    cy.get(npiField).clear().type('1234d67890')
    cy.get(npiFieldValidation).should('exist')
  })
})
