/// <reference types="cypress" />
import _ from 'lodash'
import { IsValidDate } from './util'

context('Patient Detail (pid) View ', () => {
  beforeEach(() => {
    cy.login()

    // Goes to patients / patient details
    cy.visit('/patients/spyrt_p10728?timeout=300')
  })
  it('Has breadcrumb links', () => {
    cy.get('[data-cy=headerTitle] a')
      .should('exist')
      .should('be.visible')
      .click()
    cy.url().should('match', /patients\/?$/gim)
  })

  it('shows notes with dates in the correct format', () => {
    cy.get('[data-cy=patient-history-stepper-note-log-list]')
      .find('time')
      .then((what) => {
        _.forEach(what, (val) => IsValidDate(val.innerText))
      })
  })
})

context('Non Billable Patient Detail (pid) View ', () => {
  beforeEach(() => {
    cy.login()

    // We keep these query strings for a fast timeout
    // to make sure no timeouts are activated in this test
    cy.visit('/patients/spyrt_p10000?timeout=300&continueTimeout=1')
  })

  it('Does not show the timer when visits api is called', () => {
    cy.intercept(
      `${Cypress.env('api_server')}/patients/spyrt_p10000/visits`
    ).as('postVisit')

    cy.wait(['@postVisit']).its('response.statusCode').should('eq', 409)
    cy.get('[data-cy=patientTimer]').should('not.exist')
  })

  it('Does not try to stop the timer when navigating away', () => {
    cy.get('[data-cy="Patients"]').click()

    cy.intercept(`${Cypress.env('api_server')}/patients/spyrt_p10000/visits/*`)
      .as('postVisitWithID')
      .then((intercept) => {
        console.log('intercept: ', intercept)
        expect(intercept).to.be.null
      })
  })
})

context('Billable Patient with no keyboard/mouse activity', () => {
  // Timer should be started and time should be saved
  // after timeout and confirm window lapses
  beforeEach(() => {
    cy.login(Cypress.env('billable_user'), Cypress.env('billable_pass'))
  })

  it('Detects no activity and counts down to logout', () => {
    cy.visit('/patients/spyrt_p10730?timeout=300&continueTimeout=1')

    cy.intercept(
      `${Cypress.env('api_server')}/patients/spyrt_p10730/visits/*`
    ).as('postVisitWithID')

    cy.wait(['@postVisitWithID']).its('response.statusCode').should('eq', 204)

    cy.url().should('include', 'signin')
  })
})

context('Billable Patient', () => {
  beforeEach(() => {
    cy.login(Cypress.env('billable_user'), Cypress.env('billable_pass'))
    cy.visit('/patients/spyrt_p10730?timeout=300')
  })
  it('Has a timer', () => {
    cy.get('[data-cy=patientTimer]').should('exist')
  })

  it('Has a confirm dialog open', () => {
    cy.get('[data-cy=patientActivityContinue]').contains('Continue')
  })

  it('Closes the dialog and continues the patient session', () => {
    cy.get('[data-cy=patientActivityContinue]').click()
    cy.get('[data-cy=patientTimer]').should('exist')
  })

  it('Starts the timer for a billable patient', () => {
    // Sends a successful POST to the visits API
    // Example: https://dev-dasher.knox.co/api/v2/patients/spyrt_p10000/visits/
    cy.intercept(
      `${Cypress.env('api_server')}/patients/spyrt_p10730/visits`
    ).as('postVisit')

    cy.wait(['@postVisit']).its('response.statusCode').should('eq', 201)

    cy.get('[data-cy="patientActivityContinue"]').click()
  })

  it('Stops the timer when navigating back to /patients', () => {
    // Sends a successful POST to /visits/[VISIT_ID] to stop the visit timer
    // Example: https://dev-dasher.knox.co/api/v2/patients/spyrt_p10000/visits/18026,2022-01-...
    // Any route change within the app will save the timer
    cy.get('[data-cy="Patients"]').click()

    cy.intercept(
      `${Cypress.env('api_server')}/patients/spyrt_p10730/visits/*`
    ).as('postVisitWithID')

    cy.wait(['@postVisitWithID']).its('response.statusCode').should('eq', 204)
  })

  // TODO: research a reproducable way to test onbeforeunload
  it.skip('Reloads and saved the time', () => {
    // This triggers onBeforeUnload which is used to execute a call to visits/[visitId]
    // Basically, refreshing or closing the browser tab
    // will try to save the current recorded time
    cy.reload()

    cy.intercept(
      `${Cypress.env('api_server')}/patients/spyrt_p10730/visits/*`
    ).as('postVisitWithID2')

    cy.wait(['@postVisitWithID2']).its('response.statusCode').should('eq', 204)
  })
})
