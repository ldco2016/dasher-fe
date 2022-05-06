import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { styled } from '@mui/system'
import Moment from 'react-moment'
import moment from 'moment'
import { isNil } from 'lodash'
import { CircleLoader } from '../loaders'
import SpirometryGraphs from './SpirometryGraphs'
import { nanoid } from 'nanoid'
import { useAppContext } from 'context'
import useSWRWithToken from 'hooks/useSWRWithToken'

const LogList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: `0 0 ${theme.spacing(2)} 0`,

  '& li': {
    padding: `${theme.spacing(2)} 0 0  0`,
    position: 'relative',
    '& header': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& section': {
      marginTop: theme.spacing(1),
    },
  },
}))

interface ILogItem {
  title?: string
  content?: string
  inlineTitle?: boolean
  style?: object
  date?: string
}

const LogItem = ({
  title = 'Default Title',
  content = 'default content',
  inlineTitle = true,
  style,
  date = null,
}: ILogItem) => (
  <section style={{ position: 'relative', ...style }}>
    <Typography
      variant="h3"
      component="span"
      sx={{ fontSize: '1em', display: `${inlineTitle ? 'inline' : 'block'}` }}
    >
      {title}
    </Typography>{' '}
    <Typography
      variant="body2"
      component="span"
      sx={{ fontSize: '1em', display: 'inline' }}
    >
      {content}
    </Typography>
    {/* For the manual event log */}
    {date && (
      <Typography
        variant="body2"
        component="span"
        sx={{
          position: 'absolute',
          top: -2,
          right: 0,
        }}
      >
        <Moment format="hh:mm A" date={`${date}`} />
      </Typography>
    )}
  </section>
)

type IPatientJournalState = {
  patientJournal: Array<object>
  patientJournalError: object
}

export default function PatientLog({ pid, day }) {
  const [sortedCharts, setSortedCharts] = useState([])
  const [patientJournalState, setPatientJournalState] = useState<
    IPatientJournalState | boolean
  >(false)

  const { day: logDay, fev1Ref, fev1Other } = day

  // Make sure incoming date string is local time
  const startOfDay = moment(logDay).startOf('day').local().toISOString()
  const endOfDay = moment(logDay).endOf('day').local().toISOString()
  const { state } = useAppContext()

  const { data: patientJournal, error: patientJournalError } = useSWRWithToken(
    `/patients/${pid}/journal?fromDate=${startOfDay}&toDate=${endOfDay}`
  )

  const { data: graphDataFlowVolume, error: graphDataFlowVolumeError } =
    useSWRWithToken(`/healthWorkers/${pid}/${fev1Ref}_flowVolume`)

  const { data: graphDataVolumeTime, error: graphDataVolumeTimeError } =
    useSWRWithToken(`/healthWorkers/${pid}/${fev1Ref}_volumeTime`)

  const formattedFev1Other = fev1Other.map(({ ref, createdOn }) => {
    return {
      ref: ref,
      isOpen: false,
      // this is so we can sort without having to fetch the reports yet
      // it is named createdOn becuase we use this when merging with healthLogs
      createdOn,
    }
  })

  useEffect(() => {
    !isNil(patientJournal) || !isNil(patientJournalError)
      ? setPatientJournalState({ patientJournal, patientJournalError })
      : setPatientJournalState(false)
  }, [patientJournal, patientJournalError, pid, day])

  useEffect(() => {
    if (graphDataFlowVolume && graphDataVolumeTime) {
      setSortedCharts([
        ...formattedFev1Other,
        {
          isOpen: true,
          headingActive: true,
          createdOn: graphDataFlowVolume?.reportedAt,
          flowVolume: graphDataFlowVolume,
          volumeTime: graphDataVolumeTime,
        },
      ])
    } else {
      setSortedCharts([]) //Reset state.
    }
  }, [graphDataFlowVolume, graphDataVolumeTime, pid, day]) // formattedFev1Other ?

  const hasPatientJournal = () =>
    patientJournalState !== false &&
    typeof patientJournalState === 'object' &&
    (!isNil(patientJournalState?.patientJournal) ||
      !isNil(patientJournalState?.patientJournalError))

  if (!hasPatientJournal()) return <CircleLoader />
  if (graphDataFlowVolumeError || graphDataVolumeTimeError)
    return (
      <>
        {graphDataFlowVolumeError?.message}
        <br />
        {graphDataVolumeTimeError?.message}
      </>
    )

  const patientJournalForDisplay: Array<object> =
    typeof patientJournalState === 'object'
      ? patientJournalState.patientJournal || []
      : []

  return (
    <>
      <LogList data-cy="patientLogList">
        {[...sortedCharts, ...patientJournalForDisplay]
          .sort((firstElement, secondElement) => {
            return (
              new Date(firstElement.createdOn).getTime() -
              new Date(secondElement.createdOn).getTime()
            )
          })
          .map((entry, index) => {
            // Standard Event Log
            const {
              journalType,
              title,
              comment,
              medication,
              symptomScore,
              exercise,
              createdOn,
              viewSymptomSurvey,
            } = entry

            if (
              journalType === 'HealthLog' &&
              // Check for these basic properties to avoid showing empty logs
              // which exist for some patients
              (title ||
                comment ||
                medication ||
                symptomScore ||
                exercise ||
                viewSymptomSurvey)
            ) {
              return (
                <li key={createdOn}>
                  <header>
                    <Typography variant="h3" sx={{ fontSize: '1em' }}>
                      PATIENT LOG
                    </Typography>

                    <Typography variant="body2">
                      <Moment format="hh:mm A" date={`${createdOn}`} />
                    </Typography>
                  </header>

                  {comment && (
                    <LogItem
                      key={nanoid()}
                      title={title}
                      content={comment}
                      style={{ paddingRight: '65px' }}
                    />
                  )}

                  {medication?.controller && (
                    <LogItem
                      key={nanoid()}
                      title="Controller"
                      content={medication?.controller}
                      data-cy="graphDetailsControllerMedication"
                    />
                  )}

                  {medication?.rescue && (
                    <LogItem
                      key={nanoid()}
                      title="Rescue"
                      content={medication?.rescue}
                    />
                  )}

                  {symptomScore && (
                    <LogItem
                      key={nanoid()}
                      title="Symptom Score"
                      content={symptomScore}
                    />
                  )}

                  {exercise && (
                    <LogItem key={nanoid()} title="Exercise" content="Yes" />
                  )}
                  {viewSymptomSurvey && (
                    <LogItem
                      key={nanoid()}
                      title={`Symptom Score ${viewSymptomSurvey.score}`}
                      inlineTitle={false}
                      content={viewSymptomSurvey.details.map((surveyItem) => (
                        <LogItem
                          key={nanoid()}
                          title={surveyItem.name}
                          inlineTitle={true}
                          content={surveyItem.scoreValue}
                        />
                      ))}
                    />
                  )}
                </li>
              )
            }

            // Manual Event Log
            if (journalType === 'Event') {
              return (
                <li key={createdOn}>
                  <LogItem
                    key={nanoid()}
                    title={title}
                    inlineTitle={false}
                    content={comment}
                    date={createdOn}
                  />
                </li>
              )
            }

            if (entry.hasOwnProperty('isOpen')) {
              return entry.ref ? (
                <SpirometryGraphs
                  fevRef={entry.ref}
                  pid={pid}
                  key={`${entry.ref}_${index}`}
                  isOpen={entry.isOpen}
                />
              ) : (
                <SpirometryGraphs
                  pid={pid}
                  key={`${entry.ref}_${index}`}
                  isOpen={entry.isOpen}
                  headingActive={entry.headingActive}
                  flowVolume={entry.flowVolume}
                  volumeTime={entry.volumeTime}
                />
              )
            }
          })}
      </LogList>
    </>
  )
}
