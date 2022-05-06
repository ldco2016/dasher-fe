import React, { useState, useEffect, useContext } from 'react'
import Moment from 'react-moment'
import { Typography, Button, Box } from '@mui/material'
import PatientLog from './PatientLog'
import { GeneralObject } from 'types'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { useTheme } from '@mui/material/styles'
import { isNil } from 'lodash'
import { useAppContext } from 'context'

interface IPatientGraphDetail {
  day: GeneralObject
  pid: string | string[]
}

// TODO: pass the index instead of day from PatientStatsChart
// Originally this design only called for loading the day from the graph
const PatientGraphDetail = ({ day, pid }: IPatientGraphDetail) => {
  const theme = useTheme()
  const [selectedDay, setSelectedDay] = useState(day)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [previousDisabled, setPreviousDisabled] = useState(false)
  const [paginationDirection, setPaginationDirection] = useState<
    'previous' | 'next'
  >('previous')

  // const [appContext] = useContext(AppContext)
  const { state, dispatch } = useAppContext()

  const { patientData, chartPeriod } = state

  const showPrevious = () => {
    setPaginationDirection('previous')
    setSelectedIndex(selectedIndex - 1)
  }

  const showNext = () => {
    setPaginationDirection('next')
    setSelectedIndex(selectedIndex + 1)
  }

  const checkDataExistsForDay = (day: GeneralObject): boolean => {
    return (
      day?.fev1Ref?.length > 0 ||
      day?.controllerUsed?.length > 0 ||
      day?.rescueUsed?.length > 0 ||
      (!isNil(day?.symptomScore) && day?.symptomScore > 0)
    )
  }

  // Check if FEV1 data for the previous day and keep going if it is empty
  // This hook is trigggered whenever previous/next is selected (setSelectedIndex)
  useEffect(() => {
    // use chartPeriod 'week' | '1m' | '3m' to look ahead for empty days
    // if the end of patientData is reached and there are no more days
    // with data, disable next, same behavior with previous

    const patientDatalength = patientData.length - 1
    const daysRemaining = patientDatalength - selectedIndex
    const rangeInDays =
      chartPeriod === 'week' ? 7 : chartPeriod === '1mo' ? 30 : 90

    selectedIndex >= patientDatalength
      ? setNextDisabled(true)
      : setNextDisabled(false)

    // The first day always has a reading so no need for special 'look back' logic
    selectedIndex <= 0 ? setPreviousDisabled(true) : setPreviousDisabled(false)

    if (daysRemaining <= rangeInDays) {
      // We are on the last range of available data for this patient
      // When clicking next, if there is a day with data somewhere
      // in this last set, it will show. However, if there are 1 or more
      // days at the end of the set with no data, we want to detect this
      // and disable next

      for (let index = 0; index < daysRemaining; index++) {
        // There is at least one day in this range with data so break.
        if (checkDataExistsForDay(patientData[selectedIndex + index + 1])) break

        // We have reached the end and there is no data for this day.
        if (index + 1 === daysRemaining) setNextDisabled(true)
      }
    }

    // This will keep checking the next day until it finds one with data
    if (selectedIndex <= patientDatalength && selectedIndex >= 0) {
      checkDataExistsForDay(patientData[selectedIndex])
        ? setSelectedDay(patientData[selectedIndex])
        : paginationDirection === 'previous'
        ? showPrevious()
        : showNext()
    }
  }, [selectedIndex])

  // Find the index of the current day loaded regardless of
  // if they got here by pagination or patient graph day click
  useEffect(() => {
    setSelectedDay(day)
    // Must be set when day changes and on initial mounting
    setSelectedIndex(day.dayIndex)
  }, [day])

  return (
    <Box component="div" sx={{ fontSize: '0.75em' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          m: `${theme.spacing(0)} ${theme.spacing(-1)} ${theme.spacing(
            2
          )} ${theme.spacing(-1)}`,
        }}
      >
        <Button
          onClick={showPrevious}
          sx={{ pl: 0 }}
          disabled={previousDisabled}
        >
          <KeyboardArrowLeft />
          Previous
        </Button>
        <Button onClick={showNext} sx={{ pr: 0 }} disabled={nextDisabled}>
          Next
          <KeyboardArrowRight />
        </Button>
      </Box>
      <Typography variant="h1" sx={{ mb: 2 }} data-cy="graphDetailTime">
        <Moment format="dddd, MMMM DD, YYYY" date={`${selectedDay.day}`} />
      </Typography>
      <PatientLog day={selectedDay} pid={pid} />
    </Box>
  )
}

export default PatientGraphDetail
