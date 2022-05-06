import React from 'react'
import { GeneralObject } from 'types'
import {
  Grid,
  Tooltip as MaterialTooltip,
  Typography,
  Box,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { InfoTooltip } from 'components'
import { BASELINE_COPY, SYMPTOM_SCORE_COPY } from '../../constants'

// TODO: type these properly
interface IChartLegend {
  metrics: any
  events: any
}

// TODO: makes this static and simplify (originally this was dynamic with interactions)
const ChartLegend = ({ metrics, events }: IChartLegend) => {
  const theme = useTheme()
  const renderChartHeaderLegend = (element: GeneralObject, index: number) => {
    let legendStyle: GeneralObject = { background: theme.palette.grey[400] }
    let textSuppliment: string
    if (element.elementName === 'Bad Readings') return

    switch (element.elementName) {
      case 'Baseline':
        textSuppliment = 'FEV1 '
        legendStyle = {
          backgroundImage: `linear-gradient(to right, ${theme.palette.brightBlue.main} 33%, rgba(255,255,255,0) 0%)`,
          backgroundPosition: 'center',
          backgroundSize: '8px 3px',
          backgroundRepeat: 'repeat-x',
        }
        break
      case 'SS':
        textSuppliment = 'Symptom Score '
        break
      case 'Controller':
        legendStyle = { background: theme.palette.purple.main }
        break
      case 'Rescue':
        legendStyle = { background: theme.palette.error.main }
        break
    }

    if (element.elementName === 'Baseline')
      return (
        <>
          <Typography sx={{ display: 'inline', ml: 2 }}>
            <Box
              component="span"
              sx={{
                width: '30px',
                height: '30px',
                display: 'inline-block',
                verticalAlign: 'middle',
                mr: 1,
                ...legendStyle,
              }}
            ></Box>
            {textSuppliment}
            {element.elementName}
          </Typography>
          <InfoTooltip content={BASELINE_COPY} />
        </>
      )
    return (
      element.elementName !== 'FEV1' &&
      element.elementName !== 'FEV1 Others' &&
      element.elementName !== 'Other' && (
        <>
          <MaterialTooltip title={element.elementDescription} key={index}>
            <Typography variant="body1" sx={{ display: 'inline-block', ml: 2 }}>
              <Box
                component="span"
                sx={{
                  width: '20px',
                  height: '20px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  mr: 1,
                  ...legendStyle,
                }}
              ></Box>
              {textSuppliment}
              {element.elementName}
            </Typography>
          </MaterialTooltip>
          {element.elementName === 'SS' ? (
            <InfoTooltip content={SYMPTOM_SCORE_COPY} />
          ) : null}
        </>
      )
    )
  }

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 2 }} justifyContent="space-between">
        <Grid item>
          {metrics?.groupElements.map((buttonElement, index) => (
            <span key={index}>
              {renderChartHeaderLegend(buttonElement, index)}
            </span>
          ))}
        </Grid>

        <Grid
          item
          sx={{
            textAlign: 'right',
          }}
        >
          {events?.groupElements.map((buttonElement, index) => (
            <span key={index}>
              {renderChartHeaderLegend(buttonElement, index)}
            </span>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default ChartLegend
