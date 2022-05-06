import React, { useState, useEffect } from 'react'
import { isNil } from 'lodash'
import PatientStatsChart from './PatientStatsChart'
import { GeneralObject } from 'types'
import { CircleLoader } from 'components/loaders'
import { useAppContext } from 'context'
import useSWRWithToken from 'hooks/useSWRWithToken'

interface IPatientStats {
  pid: string | string[]
  setRightDrawerOpen: (day: GeneralObject) => void
  closeRightDrawer: () => void
}

const PatientStats = ({
  pid,
  setRightDrawerOpen,
  closeRightDrawer,
}: IPatientStats) => {
  const [formattedPatientData, setFormattedPatientData] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [events, setEvents] = useState(null)
  const { dispatch } = useAppContext()

  const { data: patientData, error: patientDataError } = useSWRWithToken(
    `/patients/${pid}/reports/patientDataDashboard`
  )

  useEffect(() => {
    dispatch({
      type: 'SET_PATIENT_DATA',
      payload: formattedPatientData,
    })
  }, [formattedPatientData, pid])

  useEffect(() => {
    if (
      patientData &&
      !formattedPatientData.length &&
      !patientData?.errorCode
    ) {
      // go through all of the readings and build up an object
      // in the format required by recharts and PatientStatsChart
      const _formattedPatientData = patientData.axes[0].axisData.map(
        (day, index) => {
          const localTime = new Date(day.valueDate).toISOString()
          return {
            // Add index to work around recharts
            dayIndex: index,
            day: localTime,
            fev1: null,
            fev1Ref: null,
            _fev1: [],
            fev1Other: [],
            controllerUsed: null,
            rescueUsed: null,
            baseline: null,
            symptomScore: 0,
            original: null,
          }
        }
      )

      patientData.series.map((seriesType) => {
        seriesType.seriesData.map((data) => {
          const formattedDataSelector =
            _formattedPatientData[data.values[1].element]

          switch (seriesType.seriesId) {
            case 'yFev1':
              formattedDataSelector.fev1 = data.values[0].valueInt
              formattedDataSelector.fev1Ref = data.ref
              formattedDataSelector._fev1.push(data)
              break
            case 'yFev1Other':
              formattedDataSelector.fev1Other.push(data)
              break
            case 'yBaseline':
              formattedDataSelector.baseline = data.values[0].valueInt
              break
            case 'yMedController':
              formattedDataSelector.controllerUsed = data.values[0].valueString
              break
            case 'yMedRescue':
              formattedDataSelector.rescueUsed = data.values[0].valueString
              break
            case 'yMedSymptomScore':
              formattedDataSelector.symptomScore = data.values[0].valueInt
              break
            default:
              break
          }
        })
      })

      // Set the state which will be passed to PatientStatsChart
      setFormattedPatientData(_formattedPatientData)

      // Used to build button controls above PatientStatsChart graph
      const { groups } = patientData
      setMetrics(groups.filter((obj) => obj.groupId === 'metrics')[0])
      setEvents(groups.filter((obj) => obj.groupId === 'events')[0])
    }
  }, [patientData, pid])

  const handleFev1Click = (day: GeneralObject) => {
    if (isNil(day)) return

    // TODO: see about reusing checkDataExistsForDay() in PatientGraphDetail
    const hasData =
      !isNil(day.fev1) ||
      !isNil(day.fev1Ref) ||
      !isNil(day.controllerUsed) ||
      !isNil(day.rescueUsed) ||
      (!isNil(day.symptomScore) && day.symptomScore !== 0)

    if (hasData) {
      setRightDrawerOpen(day)
    } else {
      closeRightDrawer() //Close drawer if if no-data click
      console.warn('No Data (unless bug)', day)
    }
  }

  if (isNil(patientData) && isNil(patientDataError)) return <CircleLoader />
  if (!isNil(patientDataError)) return <div>Failed to load patient stats</div>

  const validPatientData =
    !isNil(formattedPatientData) &&
    !patientData?.errorCode &&
    !isNil(patientData)
  return (
    <>
      {validPatientData ? (
        <PatientStatsChart
          metrics={metrics}
          events={events}
          handleFev1Click={handleFev1Click}
        />
      ) : (
        <>No graph data available.</>
      )}
    </>
  )
}

export default PatientStats
