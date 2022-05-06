import React, { useEffect } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PatientStatsChart from '../components/charts/PatientStatsChart'
import patientFixtures from '../cypress/fixtures/component/patientStats/spirometryReadings.json'
import metrics from '../cypress/fixtures/component/patientStats/metrics.json'
import events from '../cypress/fixtures/component/patientStats/events.json'
import { useAppContext } from 'context'

export default {
  title: 'Patient Stats Chart',
  component: PatientStatsChart,
} as ComponentMeta<typeof PatientStatsChart>

const TemplateFourteen: ComponentStory<typeof PatientStatsChart> = (args) => {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    dispatch({
      type: 'SET_PATIENT_DATA',
      payload: patientFixtures[0].patientData,
    })
  }, [])

  return state.patientData.length ? (
    <PatientStatsChart {...args} />
  ) : (
    <div>loading patient data</div>
  )
}

const TemplateFour: ComponentStory<typeof PatientStatsChart> = (args) => {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    dispatch({
      type: 'SET_PATIENT_DATA',
      payload: patientFixtures[1].patientData,
    })
  }, [])

  return state.patientData.length ? (
    <PatientStatsChart {...args} />
  ) : (
    <div>loading patient data</div>
  )
}

const TemplateWide: ComponentStory<typeof PatientStatsChart> = (args) => {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    dispatch({
      type: 'SET_PATIENT_DATA',
      payload: patientFixtures[2].patientData,
    })
  }, [])

  return state.patientData.length ? (
    <PatientStatsChart {...args} />
  ) : (
    <div>loading patient data</div>
  )
}

export const FourteenDays: ComponentStory<typeof PatientStatsChart> =
  TemplateFourteen.bind({})

export const FourDays: ComponentStory<typeof PatientStatsChart> =
  TemplateFour.bind({})

export const WideRanges: ComponentStory<typeof PatientStatsChart> =
  TemplateWide.bind({})

FourteenDays.args = {
  metrics,
  events,
  handleFev1Click: () => {},
}

FourDays.args = {
  ...FourteenDays.args,
}

WideRanges.args = {
  ...FourteenDays.args,
}
