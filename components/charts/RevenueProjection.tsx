import React, { useState } from 'react'
import {
  Typography,
  Grid,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import ContentBlock from '../ContentBlock'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
} from 'recharts'
import { useStaticTooltip, CustomComponentArea } from './StaticTooltip'
import NumberFormat from 'react-number-format'
import { useTheme, styled } from '@mui/system'

const TipStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  textAlign: 'center',
  zIndex: 1,
  width: '95px',
  background: theme.palette.revenueGreen.main,
  padding: theme.spacing(0.5),
  borderRadius: '5px',
  color: 'white',

  '& >::after': {
    content: '""',
    display: 'inline-block',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: `5px solid ${theme.palette.revenueGreen.main}`,
    position: 'absolute',
    bottom: '-4px',
    left: '44px',
  },
}))

const DynamicTipStyle = styled(TipStyle)(({ theme }) => ({
  background: theme.palette.grey[200],
  position: 'relative',
  color: 'black',
  '& .revenue': {
    color: theme.palette.revenueGreen.main,
  },
  '& >::after': { display: 'none' },
}))

const CustomMovingTooltip = ({ active, payload }) => {
  if (payload[0]) {
    const {
      payload: { patientCount, revenuePast, revenueProjected },
    } = payload[0]

    return (
      <DynamicTipStyle>
        {patientCount} patient{patientCount > 1 && 's'}
        <br />
        <b>
          <NumberFormat
            className="revenue"
            value={
              revenuePast ? Math.round(revenuePast / 10) * 10 : revenueProjected
            }
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />
        </b>
      </DynamicTipStyle>
    )
  }

  return null
}
const RevenueProjection = ({
  pastData,
  thePresent,
  scenario20,
  scenario50,
  scenario100,
}) => {
  const theme = useTheme()
  const [scenarioNumber, setScenarioNumber] = useState(20)

  const initialTooltip = useStaticTooltip()
  const secondTooltip = useStaticTooltip()

  const [projection, setProjection] = useState(scenario20)
  const changeProjection = (event, value: number) => {
    setScenarioNumber(value)
    switch (value) {
      case 20:
        setProjection(scenario20)
        break
      case 50:
        setProjection(scenario50)
        break
      case 100:
        setProjection(scenario100)
        break
      default:
        setProjection(scenario20)
        break
    }
  }

  return (
    <ContentBlock>
      <Grid container>
        <Grid item xs={12} sm={5}>
          <Typography variant="h2" data-cy={'revenue-projection-header'}>
            Revenue Projection
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={7}
          sx={{
            textAlign: {
              xs: 'left',
              sm: 'right',
            },
            mt: {
              xs: 1,
              sm: -0.4,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ mr: 1, mb: 0.5, display: 'inline-block' }}
          >
            New patients
          </Typography>

          <ToggleButtonGroup
            size="small"
            value={scenarioNumber}
            exclusive
            onChange={changeProjection}
          >
            <ToggleButton value={20}>+20</ToggleButton>
            <ToggleButton value={50}>+50</ToggleButton>
            <ToggleButton value={100}>+100</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Typography
        variant="body1"
        sx={{
          mb: {
            xs: 5,
            sm: 4,
            lg: 1,
          },
          mt: 1,
        }}
        cy-data={'projectionEstimateText'}
      >
        Estimations are based on the addition of new&nbsp;patients
      </Typography>

      <div style={{ position: 'relative' }}>
        <TipStyle
          sx={{
            top: secondTooltip.staticPointItem?.y - 53,
            left: secondTooltip.staticPointItem?.x - 50,
          }}
          data-cy={'patientRevenueTip1'}
        >
          {secondTooltip.staticPointItem?.payload.patientCount} patient
          {secondTooltip.staticPointItem?.payload.patientCount > 1 && 's'}
          <br />
          <b data-cy={'revenueProjectedDollar1'}>
            <NumberFormat
              value={secondTooltip.staticPointItem?.payload.revenueProjected}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </b>
        </TipStyle>
        <TipStyle
          sx={{
            top: initialTooltip.staticPointItem?.y - 53,
            left: initialTooltip.staticPointItem?.x - 50,
          }}
          data-cy={'patientRevenueTip2'}
        >
          {initialTooltip.staticPointItem?.payload.patientCount} patient
          {initialTooltip.staticPointItem?.payload.patientCount > 1 && 's'}
          <br />
          <b data-cy={'revenueProjectedDollar2'}>
            <NumberFormat
              value={initialTooltip.staticPointItem?.payload.revenueProjected}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </b>
        </TipStyle>

        {/* TODO: determine how to better share selectors in theses scenarios */}
        <Box
          sx={{
            '& .recharts-cartesian-grid-horizontal line:first-of-type': {
              strokeOpacity: 0,
            },
            '& .recharts-cartesian-grid-horizontal line:last-child': {
              strokeOpacity: 0,
            },
            '& .recharts-tooltip-wrapper': {
              zIndex: 2,
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={[...pastData, ...projection]}
              margin={{
                top: 24,
                right: 12,
                left: -38,
                bottom: 0,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                tick={false}
                axisLine={false}
                domain={['dataMin', 'dataMax']}
              />

              <ReferenceLine
                x={thePresent?.xMonths?.mainText}
                ifOverflow="extendDomain"
                stroke="black"
              />

              {/* @ts-ignore */}
              <Tooltip content={<CustomMovingTooltip />} />

              <CustomComponentArea
                type="monotone"
                stroke={theme.palette.revenueGreen.main}
                strokeWidth={2}
                dataKey="revenuePast"
                fill="none"
                onUpdatePoints={initialTooltip.setPoints}
              />

              <CustomComponentArea
                type="monotone"
                stroke={theme.palette.revenueGreen.main}
                strokeWidth={2}
                strokeDasharray="3 3"
                dataKey="revenueProjected"
                fill="none"
                onUpdatePoints={secondTooltip.setPoints}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </div>
    </ContentBlock>
  )
}

export default RevenueProjection
