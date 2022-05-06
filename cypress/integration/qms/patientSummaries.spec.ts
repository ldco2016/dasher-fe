/// <reference types="cypress" />

context('Patient Summaries', () => {
  it('3.1 - Press "Patients" - Patients summaries are displayed.', () => {
    cy.login()
    cy.get('[data-cy=Patients]').click()

    cy.get('[data-cy=table-row-0]').should('be.visible')
    cy.screenshot()
  })

  it.skip('3.2 - Verify functions of the Asthma Control search bar. - User is able to filter patients by Asthma control ratings.', () => {
    cy.login()
    cy.get('[data-cy=Patients]').click()

    cy.get('[data-cy=table-row-0]').should('be.visible')

    cy.get('[data-cy=chip-all-all]').should('be.visible')

    cy.get('#mui-component-select-select-multiple-chip').click()

    cy.get('[data-cy=menu-item-good-1]')
      .click()
      // .get('[data-cy=menu-item-veryPoor-2]')
      // .click()
      .type('{esc}')

    cy.get('[data-cy="chip-all-all"]').should('not.exist')
    cy.get('[data-cy="chip-default-good"]').should('be.visible')
    // cy.get('[data-cy="chip-error-veryPoor"]').should('be.visible')

    cy.get('[data-cy=table-row-0]').should('be.visible')

    cy.screenshot()
  })

  it.skip('3.3 - Verify functions of the Doctors search bar. - User is able to sort filter patients by providers.', () => {
    cy.login()
    cy.get('[data-cy=Patients]').click()

    cy.get('[data-cy=table-row-0]').should('be.visible')

    cy.get('div[id=doctors-select]')
      .click()
      .get('[data-value="John Dolittle"]')
      .click()
      .get('div[id=doctors-select]')
      .contains('Dolittle')
      .get('tr[data-cy=table-row-0] td[data-cy="doctor"]')
      .contains('Dolittle')

    cy.screenshot()
  })

  it('3.4 - Verify functions of the patient search bar. - User is able to locate the patient summary via the search bar.', () => {
    cy.login()
    cy.get('[data-cy=Patients]').click()
    cy.get('[data-cy=table-row-0]').should('be.visible')

    cy.get('input[placeholder="Search by patient name"]').type('Shetty')

    cy.get('tr[data-cy=table-row-0] [data-cy="cell_Shetty, Charvi"]')
      .should('be.visible')
      .contains('Charvi')

    cy.screenshot()
  })

  it('3.5 - Sort the patients by pressing the columns of Name, Doctor, DOB, Asthma Control, FEV1 Baseline, Aluna Used. - User is able to sort the patients in ascending/descending order on the selected column.', () => {
    cy.login()
    cy.get('[data-cy=Patients]').click()
    cy.get('[data-cy=table-row-0]').should('be.visible')

    cy.get('[data-cy=table-cell-lastUsed]').click()

    cy.get('tr[data-cy=table-row-0] [data-cy="cell_integer"]').contains(/^\d+$/)

    cy.screenshot()
  })
})
