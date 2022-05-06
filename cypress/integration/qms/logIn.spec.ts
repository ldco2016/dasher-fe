/// <reference types="cypress" />
//
// Desired output is QMS 1.0: Login -- StepCode - Action - Expected Result
//  (RegEx is used via the dashes. Please use the pattern listed. The 'result' is the
//  screenshots which is taken at the end of the test. Screenshot=Result)
//
context('VnV 1.0: Login', () => {
  //beforeEach(() => {})

  it('1.1 - Enter into browser URL: https://qa-armada.alunacare.com/. - The login screen exists', () => {
    cy.visit('/')
    //Expect to be at the login page. We're not logged in.
    cy.get('main h1').should('contain', 'Log in to Aluna')
    // cy.get('main')
    cy.screenshot()
  })

  it('1.2 - Press the “Log In” button with empty email address - User sees “Invalid username or password” message.', () => {
    cy.visit('/').get('button[type=submit]').should('be.visible').click()

    cy.get('[data-cy=failed-auth]').should('to.be.visible').should('exist')

    cy.screenshot() //We want the whole page; not just the result of 'get'
  })

  it('1.3 - Enter “bad@email” in to the email field, then press “Log In” button - User sees “Invalid username or password” message.', () => {
    cy.visit('/')
      .get('input[name=email]')
      .should('be.visible')
      .get('input[name=email]')
      .type('bad@email')
      .get('button[type=submit]')
      .should('be.visible')
      .click()

    cy.get('[data-cy=failed-auth]').should('to.be.visible').should('exist')
    cy.screenshot()
  })

  it('1.4 - Enter a valid email address and leave password field empty and click “Log In” button. - User sees “Invalid username or password” message.', () => {
    cy.visit('/')
      .get('input[name=email]')
      .should('be.visible')
      .get('input[name=email]')
      .type('somedoctor@doctoroffice.org')
      .get('button[type=submit]')
      .should('be.visible')
      .click()

    cy.get('[data-cy=failed-auth]').should('to.be.visible').should('exist')
    cy.screenshot()
  })

  it('1.5 - Enter a valid email address and enter the phrase “badpassword” in password field. Click Login button. - User sees “Invalid username or password” message.', () => {
    cy.visit('/')
      .get('input[name=email]')
      .should('be.visible')
      .get('input[name=email]')
      .type('somedoctor@doctoroffice.org')
      .get('input[name=password]')
      .should('be.visible')
      .type('badpassword')
      .get('button[type=submit]')
      .should('be.visible')
      .click()

    cy.get('[data-cy=failed-auth]').should('to.be.visible').should('exist')
    cy.screenshot()
  })

  it('1.6 - Enter a valid email and password. Log in as doctor or nurse practitioner. - "Hi User" screen is displayed.', () => {
    cy.visit('/').get('input[name=email]').should('be.visible')

    cy.login()
    cy.get('main > h1').should('be.visible').contains(/^Hi/gi)

    cy.screenshot()
  })

  // Problem: Cypress doesn't allow mailto links, apparently.
  it.skip('1.7 - Return to the login screen and press "Contact Support" button on the login screen. - Email to providers@alunacare.com is displayed.', () => {
    cy.visit('/').get('input[name=email]').should('be.visible')
    cy.get('[href^=mailto]')
      .should('be.visible')
      .contains('Contact Support')
      .click()

    cy.get('[data-hovercard-id=providers@alunacare.com]', {
      timeout: 3000,
    }).should('be.visible')

    cy.screenshot()
  })

  it.skip('1.8 - Log in as doctor whose account has been disabled - User sees “Invalid username or password” message.', () => {
    // Problem: At the time I wrote this test, a disabled user wasn't possible.
    //   We'll revisit the issue later and fill this in. For now,
    //   this is 'done' but not tested. I'll skip the test.
    const disabledUser = {
      userName: '',
      password: '',
    }
    cy.visit('/')
      .get('input[name=email]')
      .should('be.visible')
      .get('input[name=email]')
      .type(disabledUser.userName)
      .get('input[name=password]')
      .should('be.visible')
      .type(disabledUser.password)
      .get('button[type=submit]')
      .should('be.visible')
      .click()

    cy.get('[data-cy=failed-auth]').should('to.be.visible').should('exist')
    cy.screenshot()
  })

  // Can't do this in Cypress.
  it.skip('1.9 - Log in using 3 different browsers concurrently - Multiple users can login at the same time.', () => {})

  it('1.10 - Navigate on the page and press "Sign Out" button - The initial Login screen is displayed.', () => {
    cy.login()
    cy.get('[data-cy=usermenubutton]')
      .should('be.visible')
      .click()
      .get('[data-cy=signOutMenuItem]')
      .click()

    cy.get('input[name=email]').should('be.visible')
  })
})
