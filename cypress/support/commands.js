Cypress.Commands.add(
  'login',
  (
    email = Cypress.env('non_billable_user'),
    password = Cypress.env('non_billable_pass')
  ) => {
    // Get the next-auth csrf token -> call the credentials endpoint -> get the session.
    cy.request('/api/auth/csrf').then((response) => {
      cy.request({
        method: 'POST',
        url: `/api/auth/callback/credentials`,
        failOnStatusCode: false, // dont fail so we can make assertions
        form: true, // we are submitting a regular form body
        body: {
          email,
          password,
          csrfToken: response.body.csrfToken,
        },
      }).then((cookies) => {
        cy.request('/api/auth/session')
        cy.visit('/')
      })
    })
  }
)
