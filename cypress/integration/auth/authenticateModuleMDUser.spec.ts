/// <reference types="cypress" />

const validPatientId = 'spyrt_p10000'
const invalidPatientId = 'thisIdDoesNotExist'
const root = window.location.origin

context.skip(
  'Module MD user login with url generated from https://qa-service.alunacare.com/api/v3/dashboard',

  () => {
    it(`should load patient detail page for ${validPatientId}`, () => {
      cy.visit(
        `/auth/signin?email=dolittle@qa.co&credentialType=mdIntegration&patientId=${validPatientId}`
      )

      cy.get('[data-cy=patient-name]')
        .should('exist')
        .should('be.visible')
        .end()
    })
    it(`should redirect to /patients for ${invalidPatientId}`, () => {
      cy.visit(
        `/auth/signin?email=dolittle@qa.co&credentialType=mdIntegration&patientId=${invalidPatientId}`
      )
      cy.url().should('eq', `${root}/patients`)
    })
    it('should go to /patients when no patientId query string paramater is supplied', () => {
      cy.visit(`/auth/signin?email=dolittle@qa.co&credentialType=mdIntegration`)
      cy.url().should('eq', `${root}/patients`)
    })
  }
)
