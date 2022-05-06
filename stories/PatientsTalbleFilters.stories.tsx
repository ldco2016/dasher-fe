import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import patientsFixtures from '../cypress/fixtures/component/patientsTable/patientsList.json'
import PatientsTable from '../components/patients/PatientsTable'

export default {
  title: 'Patients Table',
  component: PatientsTable,
} as ComponentMeta<typeof PatientsTable>

const is =
  (controlLevel) =>
  ({ scalarReports }) =>
    scalarReports.find((el) => el.value === controlLevel)

const goodControl = patientsFixtures.filter(is('good'))
const poorControl = patientsFixtures.filter(is('poor'))
const veryPoorControl = patientsFixtures.filter(is('veryPoor'))

const TemplatePatientsTableAllAsthmaControlLevels: ComponentStory<
  typeof PatientsTable
> = (args) => <PatientsTable {...args} />

export const PatientsTableAllAsthmaControlLevelsStory: ComponentStory<
  typeof PatientsTable
> = TemplatePatientsTableAllAsthmaControlLevels.bind({})

PatientsTableAllAsthmaControlLevelsStory.args = {
  patientsList: patientsFixtures,
}

export const PatientsTableGoodAsthmaControlLevelsStory: ComponentStory<
  typeof PatientsTable
> = TemplatePatientsTableAllAsthmaControlLevels.bind({})

PatientsTableGoodAsthmaControlLevelsStory.args = {
  patientsList: goodControl,
}

export const PatientsTablePoorAsthmaControlLevelsStory: ComponentStory<
  typeof PatientsTable
> = TemplatePatientsTableAllAsthmaControlLevels.bind({})

PatientsTablePoorAsthmaControlLevelsStory.args = {
  patientsList: poorControl,
}

export const PatientsTableVeryPoorAsthmaControlLevelsStory: ComponentStory<
  typeof PatientsTable
> = TemplatePatientsTableAllAsthmaControlLevels.bind({})

PatientsTableVeryPoorAsthmaControlLevelsStory.args = {
  patientsList: veryPoorControl,
}
