import React, { useEffect, useState } from 'react'
import { Typography, Grid } from '@mui/material'
import { useSession } from 'next-auth/client'
import RevenueProjection from '../components/charts/RevenueProjection'
import RevenueStats from '../components/charts/RevenueStats'
import usePermissions from '../hooks/usePermissions'
import { GeneralObject } from 'types'
import AlunaLogger from '../libs/AlunaLogger'
import { useAppContext } from 'context'
import useSWRWithToken from 'hooks/useSWRWithToken'

const Dashboard = () => {
  const logger = AlunaLogger('Dashboard')
  const { state, dispatch } = useAppContext()
  const [session] = useSession()
  const [pastData, setPastData] = useState([])
  const [scenario20, setScenario20] = useState([])
  const [scenario50, setScenario50] = useState([])
  const [scenario100, setScenario100] = useState([])
  const [thePresent, setThePresent] = useState({})
  const [revenueStatsData, setRevenueStatsData] = useState([])
  const { revenueProjection, revenueStats } = usePermissions()

  const { data: projection, error: projectionError } = useSWRWithToken(
    `healthWorkers/${session.user.pui}/reports/revenue_projection`
  )

  const getSeries = (name: string): GeneralObject => {
    return projection.series.filter((obj) => obj.seriesId === name)[0]
      .seriesData
  }

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: { pageHeading1: '', pageHeading2: 'Dashboard' },
    })
  }, [])

  // Increment Hack to get around flat revenue values in past data.
  // Static tooltip needs us to have a positive or negative change in
  // value in order to show the static tooltip where we expect to see it.
  // This value, which is passed to NumberFormat, will be rounded down
  // to the nearest 10 to correct for this in the UI.
  let i = 0
  useEffect(() => {
    logger.debug('useEffect with projection', projection)

    if (projection && !projectionError?.data?.errorCode) {
      const thePastOriginal = getSeries('thePast')
      const thePast = thePastOriginal.map((data, index) => {
        return {
          month: projection.axes[0].axisData[data.values[0].element].mainText,
          revenuePast: data.values[1].valueInt + i++,
          revenueProjected:
            thePastOriginal.length - 1 === index
              ? data.values[1].valueInt
              : null,
          patientCount: data.values[2].valueInt,
        }
      })

      const scenario_20Original = getSeries('scenario_20')
      const scenario_20 = scenario_20Original.map((data, index) => {
        return {
          month: projection.axes[0].axisData[data.values[0].element].mainText,
          revenueProjected: data.values[1].valueInt,
          patientCount: data.values[2].valueInt,
        }
      })

      const scenario_50Original = getSeries('scenario_50')
      const scenario_50 = scenario_50Original.map((data, index) => {
        return {
          month: projection.axes[0].axisData[data.values[0].element].mainText,
          revenueProjected: data.values[1].valueInt,
          patientCount: data.values[2].valueInt,
        }
      })

      const scenario_100Original = getSeries('scenario_100')
      const scenario_100 = scenario_100Original.map((data, index) => {
        return {
          month: projection.axes[0].axisData[data.values[0].element].mainText,
          revenueProjected: data.values[1].valueInt,
          patientCount: data.values[2].valueInt,
        }
      })

      // Build up an array with the past serries data and a 'scenario ie:'
      setPastData([...thePast])
      setScenario20(scenario_20.splice(thePast.length))
      setScenario50(scenario_50.splice(thePast.length))
      setScenario100(scenario_100.splice(thePast.length))

      getSeries('thePresent').map((data) => {
        setThePresent({
          xMonths: projection.axes[0].axisData[data.values[0].element],
          yRevenue: data.values[1].valueInt,
        })
      })

      // Use this for now to hide/show revenue components
      getSeries('revenueStats').map((data) => setRevenueStatsData(data))
    }
  }, [projection])

  // TODO: use something like this when the UX for no reports use case is defined
  // if (projectionError) return <div>{projectionError.data.message}</div>
  return (
    <>
      <Typography variant="h1" sx={{ marginBottom: 2 }}>
        Hi {session?.user?.firstName},
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {(revenueProjection || revenueStats) &&
          !!revenueStatsData.values.length && (
            <Grid container spacing={3}>
              {revenueProjection && (
                <Grid item xs={12} md={7}>
                  <RevenueProjection
                    pastData={pastData}
                    thePresent={thePresent}
                    scenario20={scenario20}
                    scenario50={scenario50}
                    scenario100={scenario100}
                  />
                </Grid>
              )}
              {revenueStats && !!revenueStatsData.values.length && (
                <Grid item xs={12} md={5}>
                  <RevenueStats data={revenueStatsData} />
                </Grid>
              )}
            </Grid>
          )}
      </Grid>
    </>
  )
}

Dashboard.layout = 'default'
Dashboard.auth = true

export default Dashboard
