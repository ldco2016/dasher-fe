import * as React from 'react'
import { mount } from '@cypress/react'
import { composeStories } from '@storybook/testing-react'
import * as stories from '../../../stories/PatientStatsChart.stories'

const { FourDays, FourteenDays, WideRanges } = composeStories(stories)

const checkPatientStatsTicks = (
  expectedStartValue: number = 40,
  expectedEndValue: number = 140,
  expectedLength: number = 6,
  triggerClick: boolean = true
) => {
  cy.get('[data-cy=patientStatsYFev1Tick]')
    .find('text')
    .should('have.length', expectedLength)
    .first()
    .should('contain', expectedStartValue)
    .last()
    .should('contain', expectedStartValue)

  triggerClick && cy.get('[data-cy=patient-stats-previous]').click()
}

it('Shows all of the readings for a dataset spanning less than a week.', () => {
  mount(<FourDays />)
  cy.get('[data-cy=patientGraphXAxisTick]').should('have.length', 4)
})

it.skip('Shows the begining and end of the dataset for 14 readings', () => {
  mount(<FourteenDays />)
  cy.get('[data-cy=patient-stats-previous]').click().should('be.disabled')

  // The earliest reading is the first reading on the chart after clicking previous.
  cy.get(
    ':nth-child(1) > [data-cy=patientGraphXAxisTick] > [y="32"] > tspan'
  ).should('have.text', 'Mon 02-22')
  cy.get('[data-cy=monthToggleButton]').click()

  // After month view is clicked the last reading is visible for this dataset.
  cy.get(':nth-child(14) > [data-cy=patientGraphXAxisTick] > text').should(
    'have.text',
    '3/7/2021'
  )
})

it('Goes through all possible ranges for FEV1 and renders the yAxis accordingly', () => {
  mount(<WideRanges />)

  // 1st range shown should be 40-140 with 6 ticks
  checkPatientStatsTicks(40, 140, 6)

  // 2nd range should be 40-160 with 7 ticks
  checkPatientStatsTicks(40, 160, 7)

  // 3rd range should be 40-180 with 8 ticks
  checkPatientStatsTicks(40, 180, 8)

  // 4th range should be 20-140 with 7 ticks
  checkPatientStatsTicks(20, 140, 7)

  // 5th range should be 20-160 with 8 ticks
  checkPatientStatsTicks(20, 160, 8)

  // 6th range should be 20-180 with 9 ticks
  checkPatientStatsTicks(20, 180, 9)

  // 7th range should be 0-140 with 8 ticks
  checkPatientStatsTicks(0, 140, 8)

  // 8th range should be 0-160 with 9 ticks
  checkPatientStatsTicks(0, 160, 9)

  // 9th range should be 0-180 with 10 ticks
  // no click for last set
  checkPatientStatsTicks(0, 180, 10, false)
})
