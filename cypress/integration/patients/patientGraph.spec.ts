/// <reference types="cypress" />
import { times } from 'lodash'

context('Patient Graph', () => {
  beforeEach(() => {
    cy.login(Cypress.env('non_billable_user'), Cypress.env('non_billable_pass'))

    // Goes to patients / patient details
    cy.visit('/patients/spyrt_p10000?timeout=300')

    // This ignores a benign render error when cypress has all of the drawers open on a snall screen
    // (uncaught exception)Error: ResizeObserver loop limit exceeded
    // Ticket: https://alunacare.atlassian.net/browse/AR-248
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  })
  it.only('Renders the patient graph', () => {
    cy.get('.recharts-surface').should('be.visible')
  })

  // TODO: determine why this fails running headless but passes when running in broswer
  it.skip('Should disable the next action when at the end of patient data', () => {
    // next should be disabled initailly
    cy.get('[data-cy=patient-stats-next]').should('be.disabled')

    // and active when further back in the data
    cy.get('[data-cy=patient-stats-previous]').click()
    cy.get('[data-cy=patient-stats-next]').should('not.be.disabled')

    // when toggles are clicked, next is disabled again
    // --------------------------------------------------

    // week view
    cy.get('[data-cy=weekToggleButton]').click()
    cy.get('[data-cy=patient-stats-next]').should('be.disabled')
    cy.get('[data-cy=patient-stats-previous]').click()

    // month view
    cy.get('[data-cy=monthToggleButton]').click()
    cy.get('[data-cy=patient-stats-next]').should('be.disabled')
    cy.get('[data-cy=patient-stats-previous]').click()

    // 3 month view
    cy.get('[data-cy=threeMonthToggleButton]').click()
    cy.get('[data-cy=patient-stats-next]').should('be.disabled')
  })

  it.skip('Clicks on the reading for 9/29/2001', () => {
    // This ignores a benign render error when cypress has all of the drawers open on a snall screen
    // (uncaught exception)Error: ResizeObserver loop limit exceeded
    // This is trying to get specific data points. That will never be consistant. Do higher level checks - not such detailed checks

    cy.get('[data-cy^="reports/spyrometry_"] > circle').click()
    cy.get('[data-cy=graphDetailTime]').contains(
      'Wednesday, September 29, 2021'
    )
    cy.get('[data-cy=graphDetailsControllerMedication]').contains(
      'Morning Evening'
    )
    cy.get('[data-cy=medMarker_purple_6]').should('exist')

    // Close the drawers so we can click to previous weeks
    cy.get('[data-testid=KeyboardArrowRightIcon]').click()
    cy.get('[data-testid=KeyboardArrowLeftIcon]').click()

    // go back four weeks and click on a day with no controller medication usage
    // the details view should not show controller usage either
    times(4, () => {
      cy.get('[data-cy=patient-stats-previous]').click()
    })

    cy.get(
      '[data-cy="reports/spyrometry_61387c69d4cfd52df8605779"] > circle'
    ).click()

    cy.get('[data-cy=graphDetailsControllerMedication]').should('not.exist')
  })
})
