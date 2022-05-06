import * as React from 'react'
import { mount } from '@cypress/react'
import { composeStories } from '@storybook/testing-react'
import * as stories from '../../../stories/Dialog.stories'

const { PlainAlunaDialog } = composeStories(stories)

it('Shows a plain Aluna Dialog with x to close and some string as children.', () => {
  mount(<PlainAlunaDialog />)
  cy.get('.MuiButtonBase-root-KjFju').click()
  cy.get('.MuiDialogContent-root-dZyyPg').contains('test dialog content')
  cy.get('#mui-1 > .MuiButtonBase-root-KjFju').click()
})
