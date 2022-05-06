import React, { useState } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Tooltip,
} from 'recharts'
import { ScaleType } from 'recharts/types/util/types'
import { SpirometryGraphTooltip } from '../charts/CustomElements'
import { useTheme } from '@mui/material/styles'
import ResponsiveContainerFix from '../charts/ResponsiveContainerFix'
import useMediaQuery from '@mui/material/useMediaQuery'

interface IPatientDayReadingChart {
  data: [any]
  scale?: ScaleType
  xLabel?: string
  yLabel?: string
}

const FlowVolumeChart = ({
  data,
  scale = 'auto' as ScaleType,
  xLabel = 'Volume (L)',
  yLabel = 'Flow (L/sec)',
}: IPatientDayReadingChart) => {
  const theme = useTheme()

  const [xAxisPaddingRight, setXAxisPaddingRight] = useState(10)
  const isXLargeScreenOrLess = useMediaQuery(theme.breakpoints.down('xl'))

  return (
    <ResponsiveContainerFix height={isXLargeScreenOrLess ? 170 : 230}>
      <ResponsiveContainer width="100%" aspect={1.6}>
        <LineChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -26,
            bottom: 10,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            allowDecimals={false}
            interval={0}
            tickCount={10}
            allowDataOverflow={true}
            domain={[
              0,
              (dataMax) => {
                let rounded = Math.round(dataMax)

                // If the reading ends in this range, increment to the next int
                if (dataMax - rounded < 0.5 && dataMax - rounded > 0.35) {
                  return rounded + 1
                }

                // Add padding rather than increment if it is in this range
                if (dataMax - rounded < 0.4 && dataMax - rounded > 0.03) {
                  setXAxisPaddingRight(40)
                }

                return rounded
              },
            ]}
            dataKey="values[0].valueDouble"
            label={{
              value: xLabel,
              position: 'insideBottom',
              offset: -2,
            }}
            padding={{
              left: 10,
              right: xAxisPaddingRight,
            }}
          />

          <YAxis
            type="number"
            allowDecimals={false}
            interval={0}
            allowDataOverflow={true}
            domain={[0, (dataMax) => Math.ceil(dataMax)]}
            scale="sequential"
            padding={{ top: 10, bottom: 10 }}
            label={{
              value: yLabel,
              angle: -90,
              position: 'center',
            }}
          />
          <Tooltip isAnimationActive={false} content={SpirometryGraphTooltip} />
          <Line
            dot={false}
            isAnimationActive={false}
            type="monotone"
            dataKey="values[1].valueDouble"
            strokeWidth={1}
            stroke={theme.palette.secondary.main}
          />
        </LineChart>
      </ResponsiveContainer>
    </ResponsiveContainerFix>
  )
}

export default FlowVolumeChart
