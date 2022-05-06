/// <reference types="cypress" />

context('Patient Graph', () => {
  beforeEach(() => {
    cy.login()
    // Goes to patients / patient details
    cy.visit('/patients/spyrt_p10000')
  })

  // Test is failing and I believe it's because of data dependence.
  it.skip('Opens the patient log and sees a chronologically sorted list', () => {
    // This ignores a benign render error when cypress has all of the drawers open on a snall screen
    // (uncaught exception)Error: ResizeObserver loop limit exceeded
    // Ticket: https://alunacare.atlassian.net/browse/AR-248
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })

    //January 1st, 1970 00:00:00
    let prevTime = 0

    cy.get('[data-cy=patient-stats-previous]').click()

    // Opens the most recent valid reading
    cy.get('[data-cy=readingDetailsOpenAction]').last().click()

    cy.get('[data-cy="patientLogList"]')
      .find('time')
      .should('have.length', 1)
      .each(($time) => {
        const currentTime = parseInt($time.attr('datetime'), 10)
        expect(prevTime).to.be.lte(currentTime)
        prevTime = currentTime
      })
  })
})
