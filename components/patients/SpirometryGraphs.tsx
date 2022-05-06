import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import PatientDayReadingChart from '../charts/PatientDayReadingChart'
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'
import { GeneralObject } from 'types'
import ReadingChartHeading from './ReadingChartHeading'
import { useAppContext } from 'context'
import useSWRWithToken from 'hooks/useSWRWithToken'

interface ISpirometryGraphs {
  pid: string | string[]
  fevRef?: string
  isOpen?: boolean
  headingActive?: boolean
  flowVolume?: GeneralObject
  volumeTime?: GeneralObject
}

const SpirometryGraphs = ({
  fevRef,
  pid,
  isOpen = false,
  headingActive = false,
  flowVolume = null,
  volumeTime = null,
}: ISpirometryGraphs) => {
  const theme = useTheme()
  const [_flowVolume, set_FlowVolume] = useState(null)
  const [_volumeTime, set_VolumeTime] = useState(null)
  const { state } = useAppContext()

  const { data: graphDataFlowVolume } = useSWRWithToken(
    `/healthWorkers/${pid}/${fevRef}_flowVolume`
  )
  const { data: graphDataVolumeTime } = useSWRWithToken(
    `/healthWorkers/${pid}/${fevRef}_volumeTime`
  )

  useEffect(() => {
    set_FlowVolume(graphDataFlowVolume ? graphDataFlowVolume : flowVolume)
    set_VolumeTime(graphDataVolumeTime ? graphDataVolumeTime : volumeTime)
  }, [
    //Intentionally being aggressive with this
    graphDataFlowVolume,
    graphDataVolumeTime,
    flowVolume,
    volumeTime,
    isOpen,
    pid,
    fevRef,
  ])

  return (
    <Box sx={{ mt: 2 }} component="li">
      {_flowVolume && _volumeTime && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant={!headingActive ? 'h3' : 'logHeadingActive'}
              sx={{
                color: headingActive
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              }}
            >
              {headingActive && 'Highest '}FEV1{' '}
              {_flowVolume.info?.fev1Percentage}
            </Typography>
            <Typography variant="body2">
              <Moment format="hh:mm A" date={`${_flowVolume.reportedAt}`} />
            </Typography>
          </Box>

          <Accordion
            elevation={0}
            square
            defaultExpanded={isOpen}
            sx={{
              background: theme.palette.grey[100],
              borderRadius: '5px',
              p: `${theme.spacing(1)} ${theme.spacing(2)}`,
              mt: `${theme.spacing(1)}!important`,

              '&:before': {
                display: 'none',
              },
              '& .MuiAccordionSummary-content': {
                margin: 0,
                '&.Mui-expanded': {
                  margin: 0,
                },
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ paddingLeft: 0 }}
            >
              <ReadingChartHeading flowVolume={_flowVolume} />
            </AccordionSummary>

            <AccordionDetails sx={{ padding: 0 }}>
              {_flowVolume && (
                <Box sx={{ mb: 2 }}>
                  <PatientDayReadingChart
                    data={_flowVolume?.series?.[0].seriesData}
                  />
                </Box>
              )}
              {_volumeTime && (
                <PatientDayReadingChart
                  data={_volumeTime?.series?.[0].seriesData}
                  xLabel="Time (S)"
                  yLabel="Volume (L)"
                />
              )}
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  )
}

export default SpirometryGraphs
