// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import { setGlobalConfig } from '@storybook/testing-react'
import * as sbPreview from '../../.storybook/preview'

setGlobalConfig(sbPreview)

// Import commands.js using ES2015 syntax:
import './commands'

// (1) If intended (for long-term inclusion), you need to log-out at the end of each tests.
// Ideally, there should be no dependencies or interference test-to-test.
Cypress.Cookies.defaults({
  // preserve: 'next-auth.session-token', // See (1)
})
