import React from 'react'
import moment from 'moment'
import { Box } from '@mui/material'
import { Text } from 'recharts'
import { useTheme, styled } from '@mui/system'
import { ICustomXAxisMedicationMarker } from 'types'

export const TipText = styled('div')(() => ({
  color: 'white',
  marginBottom: 1,
  '&:lastChild': {
    marginBottom: 0,
  },
}))

export const SpirometryGraphTooltip = ({ active, payload }) => {
  const theme = useTheme()
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '5px',
          pointerEvents: 'none',
          padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
            1
          )} ${theme.spacing(2)}`,
          fontSize: '12px',
        }}
      >
        {payload[0].payload.values[1].axisId}:{' '}
        {payload[0].payload.values[1].valueDouble}
        <br />
        {payload[0].payload.values[0].axisId}:{' '}
        {payload[0].payload.values[0].valueDouble}
      </Box>
    )
  }

  return null
}

const rectangleyAxisBackground = (
  <rect width="55" height="305px" x="-40" y="-287" fill="#eee"></rect>
)
export const CustomYAxisTickRight = ({ x, y, payload }) => {
  const { value } = payload
  return (
    <g transform={`translate(${x + 43},${y + 4})`}>
      {value === 0 && rectangleyAxisBackground}
      <text
        width="100"
        x={-30}
        textAnchor="start"
        data-cy="symptomScoreYAxisTick"
      >
        {value}
      </text>
    </g>
  )
}
export const CustomYAxisTickLeft = ({ x, y, payload }) => {
  const { value } = payload

  /* 
    A common element must represent the background color for yAxis
    tick lines.

    Because we can't insert an svg element into the yAxis to style
    the background of the entire axis, and we cant control the z-index
    or paint order, we must take the first painted tick line and hard 
    code a rect element style and position to represent a background.
    We do know that, for this graph, it always starts at 0,20,or 40. 
    This is then used to identify the first painted element. If we
    didn't do this, and instead painted a rect on every tick line,
    they would overlap or leave gaps depending on the number of ticks.
  */

  return (
    <g
      transform={`translate(${x - 15},${y + 4})`}
      data-cy="patientStatsYFev1Tick"
    >
      {(value === 0 || value === 20 || value === 40) &&
        (y === 310 || y === 260) &&
        rectangleyAxisBackground}
      <Text textAnchor="end">{value}</Text>
    </g>
  )
}

export const CustomXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <Text textAnchor="middle" fontWeight="bold" y={12}>
        {moment(payload.value).format('dddd')}
      </Text>
      <Text textAnchor="middle" y={32}>
        {moment(payload.value).format('l')}
      </Text>
    </g>
  )
}

export const CustomXAxisMedicationMarker = ({
  x = 0,
  y = 0,
  color = 'error',
  chartPeriod = 'week',
  payload = null,
  type = 'controller',
}: ICustomXAxisMedicationMarker) => {
  const theme = useTheme()

  const markerWidth =
    chartPeriod === 'week' ? 20 : chartPeriod === '1m' ? 14 : 8

  const xPosition =
    chartPeriod === 'week' ? -10 : chartPeriod === '1m' ? -7 : -4

  return (
    <g transform={`translate(${x},${y})`}>
      {payload.value.length && (
        <>
          <rect
            data-cy={`medMarker_${color}_${payload.index}`}
            width={markerWidth}
            height={5}
            x={xPosition}
            y={type === 'rescue' ? -6 : -3}
            fill={theme.palette[color]['main']}
          />
        </>
      )}
    </g>
  )
}
