import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Button,
  Divider,
  useMediaQuery,
} from '@mui/material'
import { isNil } from 'lodash'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Bar,
  Text,
} from 'recharts'
import {
  TipText,
  CustomYAxisTickLeft,
  CustomYAxisTickRight,
  CustomXAxisMedicationMarker,
} from './CustomElements'
import { GeneralObject } from 'types'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ResponsiveContainerFix from '../charts/ResponsiveContainerFix'
import { useAppContext } from 'context'
import ChartLegend from 'components/charts/ChartLegend'

interface IPatientStatsChart {
  handleFev1Click: (payload: GeneralObject) => void
  metrics: GeneralObject
  events: GeneralObject
}

// TODO: break this component down into smaller parts
const PatientStatsChart = ({
  handleFev1Click,
  metrics,
  events,
}: IPatientStatsChart) => {
  const theme = useTheme()
  const isMediumOrGreater = useMediaQuery(theme.breakpoints.up('md'))
  const isLargeOrGreater = useMediaQuery(theme.breakpoints.up('lg'))

  const { state, dispatch } = useAppContext()

  const [symptomScoreVisible, setSymptomScoreVisible] = useState(true)
  const [controllerVisible, setControllerVisible] = useState(true)
  const [rescueVisible, setRescueVisible] = useState(true)
  const [baselineVisible, setBaselineVisible] = useState(true)
  const [fev1Visible, setFev1Visible] = useState(true)

  // Graph Pagination & X/Y axis state
  const [currentSpanInDays, setCurrentSpanInDays] = useState(7)
  const [threeMonthDisabled, setThreeMonthDisabled] = useState(false)
  const [oneMonthDisabled, setOneMonthDisabled] = useState(false)
  const [dataStartIndex, setDataStartIndex] = useState<number>(0)
  const [dataEndIndex, setDataEndIndex] = useState<number>(7)
  const [previousDisabled, setPreviousDisabled] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [XTickInterval, setXTickInterval] = useState(0)
  // Turns off 1 week / 1 month / 3 month toggle butttons
  const [graphRangeDisabled, setGraphRangeDisabled] = useState(false)

  // Works with the 40-140 range for <YAxis yAxisId="FEV1" .../>
  const [yAxisFev1TickCount, setYAxisFev1TickCount] = useState<number>(7)
  const [dataMinComparator, setDataMinComparator] = useState<number>(40)

  const isWeekView = dataEndIndex - dataStartIndex === 7
  const isMonthView =
    dataEndIndex - dataStartIndex > 7 && dataEndIndex - dataStartIndex <= 30
  const is3MonthView = dataEndIndex - dataStartIndex > 30

  const { patientData } = state

  useEffect(() => {
    if (patientData) {
      console.debug('patientData', patientData)
      // Set the initial range in days for PatientStatsChart (1 Week)
      setRange(0, currentSpanInDays)
      setThreeMonthDisabled(patientData.length < 30)
      setOneMonthDisabled(patientData.length < 8)
    }
  }, [state, currentSpanInDays])

  const handleBarClick = (data: GeneralObject) => {
    handleFev1Click(data.payload)
  }

  function setChartPeriodWithLogic(spanInDays: number) {
    const val = spanInDays < 10 ? 'week' : spanInDays >= 89 ? '3m' : '1m'
    //setChartPeriod(val)
    dispatch({ type: 'SET_CHART_PERIOD', payload: val })
  }

  const setRange = (interval: number, spanInDays: number = 7): void => {
    if (state.patientData) {
      let start = state.patientData.length - spanInDays
      let end = state.patientData.length

      setCurrentSpanInDays(spanInDays)
      setNextDisabled(state.patientData.length === end)
      setPreviousDisabled(state.patientData.length <= spanInDays)
      setChartPeriodWithLogic(spanInDays)

      // Guard rails for small datasets
      // (prevents data from being cut off)
      if (start < 0 && end < 7) {
        start = 0
        end = 7
        interval = 0
        setGraphRangeDisabled(true)
      } else {
        setGraphRangeDisabled(false)
      }

      setDataStartIndex(start <= 0 ? 0 : start) // Don't allow negative number; I believe this will resolve AR-375
      setDataEndIndex(end)
      setXTickInterval(interval)
    }
  }

  const getNext = (dataSetSizeInDays: number) => {
    const newDataStartRange = dataStartIndex + dataSetSizeInDays
    const newDataEndRange = dataEndIndex + dataSetSizeInDays
    setPreviousDisabled(false)
    setDataStartIndex(newDataStartRange)
    setDataEndIndex(newDataEndRange)

    if (newDataEndRange >= state.patientData.length) {
      setNextDisabled(true)
      setDataStartIndex(state.patientData.length - currentSpanInDays)
      setDataEndIndex(state.patientData.length)
      return
    }
  }

  const getPrevious = (dataSetSizeInDays: number) => {
    setNextDisabled(false)

    const bound = (num: number) => (num <= 0 ? 0 : num)
    const newDataStartRange = bound(dataStartIndex - dataSetSizeInDays)
    const newDataEndRange = bound(dataEndIndex - dataSetSizeInDays)
    setDataStartIndex(newDataStartRange)
    setDataEndIndex(newDataEndRange)

    if (dataStartIndex === 0 || dataStartIndex <= dataSetSizeInDays) {
      setPreviousDisabled(true)

      // All data - index 0 to upper array bound
      setDataStartIndex(0)
      setDataEndIndex(currentSpanInDays)
    }
  }

  const dateFormats = {
    original: 'l',
    monthDay: 'M/D',
    ShortDayMonthDay: 'ddd MMM-DD',
    CapMonthDay: 'MMM-DD',
    fullDay: 'dddd',
  }

  const StateDrivenCustomXAxisTick = ({ x, y, payload }) => {
    const style = isLargeOrGreater ? '11px' : '10px'
    return (
      <g
        data-cy="patientGraphXAxisTick"
        transform={`translate(${x},${y}) ${
          !isWeekView || (isWeekView && !isLargeOrGreater) ? 'rotate(-45)' : ''
        }`}
      >
        {' '}
        {isWeekView === true ? (
          <>
            {!isLargeOrGreater && (
              <text x={-50} y={5} fontSize={style}>
                {moment(payload.value).format(dateFormats.ShortDayMonthDay)}
              </text>
            )}

            {isLargeOrGreater && (
              <>
                <Text
                  style={{ fontSize: style }}
                  textAnchor="middle"
                  fontWeight="bold"
                  y={12}
                >
                  {moment(payload.value).format(dateFormats.fullDay)}
                </Text>
                <Text style={{ fontSize: style }} textAnchor="middle" y={32}>
                  {moment(payload.value).format(dateFormats.original)}
                </Text>
              </>
            )}
          </>
        ) : null}
        {isMonthView === true ? (
          <text x={-50} y={5} fontSize={style}>
            {moment(payload.value).format(dateFormats.ShortDayMonthDay)}
          </text>
        ) : null}
        {is3MonthView === true &&
        moment(payload.value).format('ddd') === 'Mon' ? (
          <text x={-60} y={5} fontSize={style}>
            {moment(payload.value).format(dateFormats.ShortDayMonthDay)}
          </text>
        ) : null}
      </g>
    )
  }

  const Fev1GraphTooltip = ({ active, payload }) => {
    const { fev1, symptomScore, controllerUsed, rescueUsed, baseline } =
      payload[0]?.payload || {}

    const hideTip =
      isNil(fev1) &&
      isNil(rescueUsed) &&
      isNil(controllerUsed) &&
      isNil(baseline) &&
      // symptomScore shouldn't be displayed if zero.
      !symptomScore

    if (active && !hideTip) {
      return (
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '5px',
            pointerEvents: 'none',
            padding: 2,
            fontSize: '12px',
          }}
        >
          {(isMonthView || is3MonthView) && (
            <>{moment(payload[0].payload.day).format('MM/DD/YYYY')}</>
          )}
          {!!fev1 && <TipText>FEV1%: &nbsp;{fev1 || '--'}</TipText>}
          <TipText>FEV1 Baseline%: &nbsp;{baseline || '--'}</TipText>
          {!!symptomScore && (
            <TipText>Symptom Score: &nbsp;{symptomScore}</TipText>
          )}
          {controllerUsed && (
            <TipText>Controller Used: &nbsp;{controllerUsed}</TipText>
          )}
          {rescueUsed && <TipText>Rescue Used: &nbsp;{rescueUsed}</TipText>}
        </Box>
      )
    }

    return null
  }

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props
    const [radius, setRadius] = useState(4)
    return props.cy ? (
      <g
        data-cy="readingDetailsOpenAction"
        onClick={() => handleFev1Click(payload)}
        onMouseOver={() => setRadius(6)}
        onMouseOut={() => setRadius(4)}
        style={{ cursor: 'pointer' }}
        transform={`translate(${cx},${cy})`}
        fill={theme.palette.primary.main}
      >
        <circle cx="0" cy="0" r={radius} />
      </g>
    ) : null
  }

  const memoizedPatientData = useMemo(
    () => state.patientData?.slice(dataStartIndex, dataEndIndex),
    [state.patientData, dataStartIndex, dataEndIndex]
  )

  // Hack to deal with https://github.com/recharts/recharts/issues/172
  // TODO: move this into a ResponsiveContainer wrapper component which
  // takes a graph height (400 in this case) ie: ResponsiveContainerHack
  // width={'100%'} height={250}
  return (
    <>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Typography variant="h2" align="left">
              {state.patientData?.name}
            </Typography>
          </Grid>
          <Grid item sx={{ textAlign: 'right' }}>
            <Button
              sx={{ mr: 1 }}
              startIcon={<NavigateBeforeIcon />}
              data-cy="patient-stats-previous"
              onClick={() => getPrevious(currentSpanInDays)}
              disabled={previousDisabled}
            >
              Previous
            </Button>
            <Button
              sx={{ mr: 1 }}
              endIcon={<NavigateNextIcon />}
              data-cy="patient-stats-next"
              onClick={() => getNext(currentSpanInDays)}
              disabled={nextDisabled}
            >
              Next
            </Button>

            <ToggleButtonGroup
              size="small"
              value={state.chartPeriod}
              exclusive
              onChange={(event, value) =>
                dispatch({ type: 'SET_CHART_PERIOD', payload: value })
              }
            >
              <ToggleButton
                value="week"
                data-cy="weekToggleButton"
                disabled={graphRangeDisabled}
                onClick={() => setRange(0, 7)}
              >
                Week
              </ToggleButton>
              <ToggleButton
                value="1m"
                data-cy="monthToggleButton"
                disabled={graphRangeDisabled || oneMonthDisabled}
                onClick={() => setRange(0, 30)}
              >
                1M
              </ToggleButton>
              <ToggleButton
                value="3m"
                data-cy="threeMonthToggleButton"
                disabled={graphRangeDisabled || threeMonthDisabled}
                onClick={() => setRange(0, 90)}
              >
                3M
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }} />

      <ChartLegend metrics={metrics} events={events} />

      <Grid container>
        <Grid item xs>
          <ResponsiveContainerFix
            height={isLargeOrGreater ? 400 : 350}
            left={-30}
          >
            <ResponsiveContainer
              width="100%"
              height={isLargeOrGreater ? 400 : 350}
            >
              <ComposedChart
                barGap={-45}
                data={memoizedPatientData}
                margin={{
                  top: 5,
                  right: 0,
                  left: fev1Visible ? 20 : 30,
                  bottom: 40,
                }}
              >
                {symptomScoreVisible && (
                  <Bar
                    yAxisId="SS"
                    dataKey="symptomScore"
                    barSize={30}
                    onClick={handleBarClick}
                    background={{ fill: 'white', width: 30 }}
                    animationDuration={500}
                    fill={theme.palette.grey[300]}
                  />
                )}

                {/*Remove the vertical guide lines on the 3month view;
                for now we're letting the mouse hover effect be the guide. AR-309*/}
                <CartesianGrid
                  vertical={is3MonthView === false}
                  stroke={theme.palette.grey[350]}
                />

                <XAxis
                  xAxisId={0}
                  hide={!controllerVisible}
                  dataKey="controllerUsed"
                  height={10}
                  tickLine={false}
                  axisLine={false}
                  tick={
                    <CustomXAxisMedicationMarker
                      color="purple"
                      chartPeriod={state.chartPeriod}
                      type="controller"
                    />
                  }
                  interval={0}
                  padding={{
                    left: symptomScoreVisible ? 0 : 60,
                    right: symptomScoreVisible ? 0 : 40,
                  }}
                />

                <XAxis
                  xAxisId={1}
                  height={10}
                  hide={!rescueVisible}
                  dataKey="rescueUsed"
                  tickLine={false}
                  axisLine={false}
                  tick={
                    <CustomXAxisMedicationMarker
                      chartPeriod={state.chartPeriod}
                      type="rescue"
                    />
                  }
                  interval={0}
                  padding={{
                    left: symptomScoreVisible ? 0 : 60,
                    right: symptomScoreVisible ? 0 : 40,
                  }}
                />

                <XAxis
                  xAxisId={2}
                  dataKey="day"
                  tick={StateDrivenCustomXAxisTick}
                  tickLine={false}
                  axisLine={false}
                  padding={{
                    left: symptomScoreVisible ? 0 : 60,
                    right: symptomScoreVisible ? 0 : 40,
                  }}
                  interval={XTickInterval}
                />

                <YAxis
                  yAxisId="FEV1"
                  hide={!fev1Visible}
                  width={75}
                  padding={{ top: 40 }}
                  tickLine={false}
                  tick={CustomYAxisTickLeft}
                  tickCount={yAxisFev1TickCount}
                  axisLine={false}
                  /*
                      domain={[50, 110]} was the cause for AR-230. However, because
                      we need wider ranges, the range needs to be dynamic.
                      
                      The goal now is to display the FEV1 yAxis range from 40-140
                      in even increments of 20 whenever possible.
                      
                      To do this, we default the yAxis tickCount at 7 and default
                      to a domain of 40-140 which renders 40,60,80,100,120,140

                      The widest range we render is 0-180, beyond this, the readings
                      are cropped (and something is gravely wrong with the patient)
                      
                      When a patient has fev1 scores below 40 and/or above 140
                      we need to round up and down in multiples of 20 while
                      maintaining an even tick count with every increment and
                      staying as close to the min/max as possible ie:
                      20,40,60,80,100,120,140,160
                      40,60,80,100,120,140,160

                      If the range is simply set to 40-140 and allowDataOverflow
                      prop is left at it's default (false) the range will auto
                      adjust and potentially give uneven increments/tickCounts

                      increments and tick count configurations
                      40-140 tickCount = 7
                      40-160 tickCount = 7
                      40-180 tickCount = 8
                      
                      20-140 tickCount = 7
                      20-160 tickCount = 8
                      20-180 tickCount = 9

                      0-140 tickCount = 8
                      0-160 tickCount = 9
                      0-180 tickCount = 10
                    */

                  domain={[
                    (dataMin) => {
                      // Round down to 20 or 0.
                      // This could be done with Math.floor(dataMin / 10) * 10
                      // However, nested ternary is simpler and more readable.
                      // set state so it can be used to compare ends of the range
                      setDataMinComparator(parseInt(dataMin))

                      return dataMin < 40 ? (dataMin < 20 ? 0 : 20) : 40
                    },
                    // Increment up from 140 to a max of 180
                    (dataMax) => {
                      // Compare dataMin/dataMax to handle dynamic tickCount
                      if (
                        // 40-160
                        (dataMinComparator >= 40 && dataMax < 160) ||
                        // 20-140
                        (dataMinComparator >= 20 && dataMax <= 140)
                      )
                        setYAxisFev1TickCount(7)

                      if (
                        // 40-180
                        (dataMinComparator >= 40 && dataMax > 160) ||
                        // 20-160
                        (dataMinComparator >= 20 &&
                          dataMinComparator < 40 &&
                          dataMax <= 160 &&
                          dataMax > 140) ||
                        // 0-140
                        (dataMinComparator >= 0 &&
                          dataMinComparator < 20 &&
                          dataMax <= 140)
                      )
                        setYAxisFev1TickCount(8)

                      if (
                        // 20-180
                        (dataMinComparator >= 20 &&
                          dataMinComparator < 40 &&
                          dataMax <= 180 &&
                          dataMax > 160) ||
                        // 0-160
                        (dataMinComparator >= 0 &&
                          dataMinComparator < 20 &&
                          dataMax <= 160 &&
                          dataMax > 140)
                      )
                        setYAxisFev1TickCount(9)

                      if (
                        dataMinComparator >= 0 &&
                        dataMinComparator < 20 &&
                        dataMax <= 180 &&
                        dataMax > 160
                      )
                        setYAxisFev1TickCount(10)

                      return dataMax > '140' ? (dataMax > 160 ? 180 : 160) : 140
                    },
                  ]}
                  allowDataOverflow={true}
                  label={<Label value="FEV1" offset={0} position="insideTop" />}
                />

                <YAxis
                  yAxisId="SS"
                  hide={!symptomScoreVisible}
                  width={70}
                  orientation="right"
                  padding={{ top: 40 }}
                  tickCount={7}
                  tickLine={false}
                  allowDecimals={false}
                  tick={CustomYAxisTickRight}
                  axisLine={false}
                  interval={0}
                  domain={[0, 25]}
                  label={<Label value="SS" offset={0} position="insideTop" />}
                />

                <Tooltip
                  cursor={{
                    stroke: theme.palette.grey[400],
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                  content={Fev1GraphTooltip}
                />

                {baselineVisible && (
                  <Line
                    dot={false}
                    type="linear"
                    yAxisId="FEV1"
                    dataKey="baseline"
                    strokeWidth={3}
                    isAnimationActive={false}
                    stroke={theme.palette.brightBlue.main}
                    strokeDasharray="3 5"
                  />
                )}

                {fev1Visible && (
                  <Line
                    type="linear"
                    yAxisId="FEV1"
                    dataKey="fev1"
                    strokeWidth={1.5}
                    connectNulls={true}
                    dot={<CustomizedDot />}
                    activeDot={{
                      visibility: 'hidden',
                    }}
                    isAnimationActive={false}
                    stroke={theme.palette.primary.main}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ResponsiveContainerFix>
        </Grid>
      </Grid>
    </>
  )
}

export default PatientStatsChart
