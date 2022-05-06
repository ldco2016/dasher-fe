/// <reference types="cypress" />

context('Register Clinic User', () => {
  beforeEach(() => {
    cy.visit('/auth/register-clinic-user?tkn=xA6sl5DGkiHrFythlTg5')
  })

  const existVisibleDisabled = (selector) =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible')
      .should('be.disabled')
      .end()

  const existVisibleEnabled = (selector) =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible')
      .should('be.enabled')
      .end()

  // This was broken by https://github.com/KnoxMed/dasher-fe/pull/84
  // TODO: fix and make sure pre-commit hooks finish successfully
  it.skip('Form loads in correct state', () => {
    existVisibleDisabled('[name=firstName]')
    existVisibleDisabled('[name=lastName]')
    existVisibleDisabled('[name=middleName]')
    existVisibleDisabled('[name=email]')
    existVisibleDisabled('[data-cy=phone-number-field-number-format] input')

    existVisibleEnabled('[name=password]')
    existVisibleEnabled('[name=verifypassword]')

    cy.get('[name=privacy]').should('exist').should('not.be.checked').end()
    cy.get('[name=terms]').should('exist').should('not.be.checked').end()

    existVisibleEnabled('[data-cy=register-client-user-submit-button]')
  })

  it('should display contact support if invalid token ', () => {
    cy.get('[data-cy=expired-invitations]')
      .should('exist')
      .should('be.visible')
      .end()
  })
})
