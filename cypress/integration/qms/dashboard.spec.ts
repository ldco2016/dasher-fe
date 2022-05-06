/// <reference types="cypress" />
//
// Desired output is QMS 2.0 Dashboard -- StepCode - Action - Expected Result
//  (RegEx is used via the dashes. Please use the pattern listed. The 'result' is the
//  screenshots which is taken at the end of the test. Screenshot=Result)
//

context('Dashboard', () => {
  beforeEach(() => {
    cy.login(Cypress.env('billable_user'), Cypress.env('billable_pass'))
  })

  it('2.1 - Log in as doctor or nurse practitioner. - Revenue Projection and Revenue Stats screen is displayed.', () => {
    cy.get('[data-cy=revenue-projection-header]')
      .should('exist')
      .should('be.visible')
    cy.screenshot()
  })

  it('2.2 - Press new Patients +20 +50 +100. - Revenue Projection changed accordingly.', () => {
    cy.get('main div button').should('exist')
    cy.get('button[value=20]').should('exist').click()
    cy.get('button[value=50]').should('exist').click()
    cy.get('button[value=100]').should('exist').click()
    cy.screenshot()
  })

  it('2.3 - Hover the cursor over each month - Revenue Projection of the pointed month is displayed accordingly', () => {
    cy.visit('/')
    cy.get('main div line[x1=22][y1=24][x2=22][y2=270]').trigger('mouseover')
    cy.screenshot()
  })

  it('2.4 - Press "My Settings" on the top right corner - "My Settings" screen is displayed.', () => {
    cy.get('body div button[data-cy=usermenubutton]')
      .click()
      .get('body div ul li[data-cy=mySettings]')
      .contains('My Settings')
      .click()
    cy.screenshot()
  })

  it('2.5 - Press "Privacy Policy" on the "My Settings" screen. - "Aluna Privacy Policy" screen is displayed', () => {
    cy.get('body div button[data-cy=usermenubutton]')
      .click()
      .get('body div ul li[data-cy=mySettings]')
      .contains('My Settings')
      .click()
    cy.get('a[href*="/legal/privacy"]').click({ force: true })
    cy.screenshot()
  })

  it('2.6 - Press "Terms of Use" on the "My Settings" screen. - "Aluna Terms of Use" screen is displayed', () => {
    cy.get('body div button[data-cy=usermenubutton]')
      .click()
      .get('body div ul li[data-cy=mySettings]')
      .contains('My Settings')
      .click()

    cy.get('a[href*="/legal/terms"]').click({ force: true })

    cy.screenshot()
  })

  // Cannot fully complete this test as Cypress cannot screenshot the opening of third party apps.
  it('2.7 - Press "Get Support" on the top right corner. - Email to providers@alunacare.com is dispayed', () => {
    cy.get('div button[data-cy=usermenubutton]')
      .click()
      .get('div ul li[data-cy=getSupport]')
      .contains('Get support')

    cy.screenshot()
  })
})
