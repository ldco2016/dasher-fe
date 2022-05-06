/// <reference types="cypress" />
import _ from 'lodash'
import packageJson from 'package.json'
import env from '@beam-australia/react-env'

context('Non Billable Patient Detail (pid) View ', () => {
  beforeEach(() => {
    cy.login('charvi@aluna-admin.io', 'Asthmasucks2!')

    // We keep these query strings for a fast timeout
    // to make sure no timeouts are activated in this test
    cy.visit('/patients')
  })

  it.skip('Shows a feedback form with client validation', () => {
    // const description = 'yahtzee!$'

    cy.get('[data-cy=feedbackButton]').click()
    cy.get('[data-cy=feedbackSubmit]').click()
    cy.get('.Mui-required').should('contain', 'Please select a subject')
      .and('contain', 'Please add your comment')
    cy.get('[data-cy=feebackSubject]').click()

    cy.get('[data-cy="feebackSubject"] > :nth-child(2)').click()

    // cy.get('[data-cy="comment"]').click().type(description)

    // Intercept the call to the feedback API so that it does not
    // POST actual data
    // GOAL: To verify what is coming out of feedback component and
    // that hidden formData is being submitted
    // Verify that app is pulling in the expected version in 'COMMIT_SHA1'
    cy.intercept(`${Cypress.env('api_server')}/feedback`, {
      statusCode: 201,
      // body: {
      //   "feedbackId": 74,
      //   "feedbackType": "Suggestion",
      //   "product": "armada",
      //   "version": packageJson.version,
      //   "buildId": Cypress.env('CURRENT_COMMIT_SHA1'),
      //   "fullname": "John Dolittle",
      //   "pui": "spyrt_p10102acc",
      //   "contactEmail": "dolittle@qa.co",
      //   description,
      //   "createdOn": "2022-01-31T21:57:57.085304141Z",
      //   "updatedOn": "2022-01-31T21:57:57.085304141Z",
      //   "feedbackStatus": "Created"
      // },
    }).as('postFeedBack')

    cy.get('[data-cy="feedbackSubmit"]').click()

    cy.wait('@postFeedBack')
      .then((intercept) => {
        expect(intercept.request.body).to.deep.equal({
          "feedbackType": "Suggestion",
          "product": "armada",
          "version": packageJson.version,
          "buildId": Cypress.env('CURRENT_COMMIT_SHA1'),
          "fullname": "Charvi Aluna-admin.io",
          "pui": "spyrt_p10022acc",
          "contactEmail": "charvi@aluna-admin.io",
          // description,
        })
      }).its('response.statusCode').should('eq', 201)

  })

  describe('entering some text', () => {
    beforeEach(() => {
      const description = 'yahtzee!$'
      cy.get('[data-cy="comment"]').click().type(description)
    })

    it('shows that text in the text area', () => {

    });

    it('when submitted clears the input', () => {

    });
  });


  //   buildId: "undefined"
  // contactEmail: "charvi@aluna-admin.io"
  // description: "yahtzee!"
  // feedbackType: "Suggestion"
  // fullname: "Charvi Aluna-admin.io"
  // product: "armada"
  // pui: "spyrt_p10022acc"
  // version: "1.0.1"

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

