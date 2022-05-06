import * as React from 'react'
import { mount } from '@cypress/react'
import { composeStories } from '@storybook/testing-react'
import * as stories from '../../../stories/PatientsTalbleFilters.stories'

const {
  PatientsTableAllAsthmaControlLevelsStory,
  PatientsTableGoodAsthmaControlLevelsStory,
  PatientsTablePoorAsthmaControlLevelsStory,
  PatientsTableVeryPoorAsthmaControlLevelsStory,
} = composeStories(stories)

it('Shows the patients table with every filter option available', () => {
  mount(<PatientsTableAllAsthmaControlLevelsStory />)
  cy.get('[data-cy="cell_good"]').should('be.visible')
  cy.get('[data-cy="cell_poor"]').should('be.visible')
  cy.get('[data-cy="cell_veryPoor"]').should('be.visible')
  cy.get('#mui-component-select-select-multiple-chip').click()

  cy.get('[data-cy="menu-item-good-1"]').should('exist')
  cy.get('[data-cy="menu-item-poor-2"]').should('exist')
  cy.get('[data-cy="menu-item-veryPoor-3"]').should('exist')
})

it('Shows the patients table with only "good" filter option available', () => {
  mount(<PatientsTableGoodAsthmaControlLevelsStory />)
  cy.get('[data-cy="cell_good"]').should('be.visible')
  cy.get('[data-cy="cell_poor"]').should('not.exist')
  cy.get('[data-cy="cell_veryPoor"]').should('not.exist')

  cy.get('#mui-component-select-select-multiple-chip').click()

  cy.get('[data-cy="menu-item-good-1"]').should('exist')
})

it('Shows the patients table with only "poor" filter option available', () => {
  mount(<PatientsTablePoorAsthmaControlLevelsStory />)
  cy.get('[data-cy="cell_good"]').should('not.exist')
  cy.get('[data-cy="cell_poor"]').should('be.visible')
  cy.get('[data-cy="cell_veryPoor"]').should('not.exist')

  cy.get('#mui-component-select-select-multiple-chip').click()

  cy.get('[data-cy="menu-item-poor-1"]').should('exist')
})

it('Shows the patients table with only "Very Poor" filter option', () => {
  mount(<PatientsTableVeryPoorAsthmaControlLevelsStory />)
  cy.get('[data-cy="cell_good"]').should('not.exist')
  cy.get('[data-cy="cell_poor"]').should('not.exist')
  cy.get('[data-cy="cell_veryPoor"]').should('be.visible')

  cy.get('#mui-component-select-select-multiple-chip').click()

  cy.get('[data-cy="menu-item-veryPoor-1"]').should('exist')
})
