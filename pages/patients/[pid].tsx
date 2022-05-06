import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from 'context'
import { useTheme, styled } from '@mui/system'
import {
  Box,
  Grid,
  IconButton,
  Link,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import NextLink from 'next/link'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { DRAWER_WIDTH, DRAWER_WIDTH_SM } from '../../constants'

import ContentBlock from 'components/ContentBlock'
import useMediaQuery from '@mui/material/useMediaQuery'
import PatientStats from 'components/charts/PatientStats'
import Drawer from 'components/Drawer'
import { GeneralObject } from 'types'
import PatientGraphDetail from 'components/patients/PatientGraphDetail'
import PateientDetailHeader from 'components/patients/PatientDetailHeader'
import PatientHistoryStepper from 'components/PatientHistoryStepper'
import env from '@beam-australia/react-env'
import { CountDownTimer } from 'components/patients/Timers'
import axios from 'axios'
import { signOut } from 'next-auth/client'
import { isNil } from 'lodash'
import { throttle } from 'lodash'
import AlunaLogger from 'libs/AlunaLogger'
import { isFirefox, isSafari } from 'react-device-detect'
import useSWRWithToken from 'hooks/useSWRWithToken'
import nameAdapter from '../../libs/nameAdapter'
import Feedback from 'components/feedback'

const ToggleArrowRight = styled('div')(({ theme }) => ({
  left: -12,
  top: 15,
  position: 'absolute',
  '& button': {
    position: 'fixed',
    zIndex: '1300',
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '24px',
    height: '24px',
    background: 'white',
    borderRadius: '50%',
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
  },
}))

/*
  When the patient page loads, a timer is activated.
  React Context is set which causes the timer component to
  immediately become visible in the app header and begin 
  counting.

  Next, an api call is made to /patients/[pid]/visits
  which begins the timer on the backend. 
  
  The timer will continue on the frontend until:

  A. The user navigates to another page in the app either
     by clicking another link in the page or browser back.
  
  B. An error comes back from the API
  
  C. There is more than 2 minutes of inactivity 
      - if this happens a modal appears allowing the
        user to keep going. It will timeout after an
        additional 15 seconds and stop the timer if there
        is no action.

  D. A call to /patients/[pid]/visits/[id] (records and stops timer)

  E. The browser tab is closed

*/

// 2 minutes
const delay = 120000

const Patient = () => {
  const router = useRouter()
  const logger = AlunaLogger('Patient:pid', true)
  const { pid } = router.query
  const theme = useTheme()

  const isMediumScreenOrLess = useMediaQuery(theme.breakpoints.down('md'))
  const isLargeScreenOrLess = useMediaQuery(theme.breakpoints.down('lg'))
  const isXLargeScreenOrLess = useMediaQuery(theme.breakpoints.down('xl'))

  const [rightDrawerDay, setRightDrawerDay] = useState(null)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true)

  // Timer state and context accepts a timeout from query string ?timeout=4000
  const [inactivityDelay, setInactivityDelay] = useState<number | null>(null)
  const [isIdle, setIsIdle] = useState<boolean>(false)
  const [billingSessionTimeout, setBillingSessionTimeout] = useState<Date>(null)

  // Assume the user is billable unless there is an error POSTing to /visits
  // This is due to the poorly designed legacy /visits API
  const [userBillable, setUserBillable] = useState(true)

  const [timerID, setTimerID] = useState<string>('')
  const timerIDRef = useRef()

  const { state, dispatch } = useAppContext()

  const {
    token: { accessToken },
  } = state

  const { data: patient, error: patientError } = useSWRWithToken(
    `/patients/${pid}`
  )

  // Only fetch medications if a patient exists
  const { data: medications } = useSWRWithToken(
    `/patients/${pid}/medications`,
    !!patient
  )

  // redirect to patients list if there are any problems fetching the patient
  !!patientError && router.push('/patients')

  // Set state for the app header
  useEffect(() => {
    // https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: (
          <NextLink passHref href="/patients/">
            <Link>Patients</Link>
          </NextLink>
        ),
        pageHeading2: patient?.lastName?.trim()
          ? `${patient?.lastName?.trim()}, ${patient?.firstName?.trim()}`
          : nameAdapter(patient?.firstName),
      },
    })
  }, [patient])

  // Hide Drawers if the window is < 900px wide (medium)
  useEffect(() => {
    isMediumScreenOrLess && setLeftDrawerOpen(false)
    isMediumScreenOrLess && setRightDrawerOpen(false)

    window.onresize = () => {
      isMediumScreenOrLess && setLeftDrawerOpen(false)
      isMediumScreenOrLess && setRightDrawerOpen(false)
    }
  }, [isMediumScreenOrLess])

  const handleToggleLeftDrawer = () => {
    isXLargeScreenOrLess && rightDrawerOpen && setRightDrawerOpen(false)
    setLeftDrawerOpen(!leftDrawerOpen)
  }

  const handleToggleRightDrawer = () => {
    isXLargeScreenOrLess && leftDrawerOpen && setLeftDrawerOpen(false)
    setRightDrawerOpen(!rightDrawerOpen)
  }

  const setRightDrawerContent = async (day: GeneralObject) => {
    isLargeScreenOrLess && leftDrawerOpen && setLeftDrawerOpen(false)

    await setRightDrawerDay(day)
    if (!rightDrawerOpen || day === rightDrawerDay) handleToggleRightDrawer()
  }

  // Timer related methods and hooks
  // -----------------------------------------------------------------------

  // resetBillingSessionTimeout called after:
  // - 200 response from startTrackingTimeSpent
  // - accessToken is set
  // - 'Continue' button is clicked
  const resetBillingSessionTimeout = () => {
    // 15 second count down for billing session timeout modal
    // Optionally pass:
    // /patients/[pid]?timeout=5000&continueTimeout=45
    // to test the count down timer
    const time = new Date()
    const timeoutInSeconds = router.query.continueTimeout
      ? Number(router.query.continueTimeout)
      : 15

    time.setSeconds(time.getSeconds() + timeoutInSeconds)
    setBillingSessionTimeout(time)
  }

  useEffect(() => {
    if (inactivityDelay) {
      const timer = setTimeout(() => {
        resetBillingSessionTimeout()
        setIsIdle(true)
        clearTimeout(timer)
      }, inactivityDelay)
      return () => clearTimeout(timer)
    }
  }, [inactivityDelay])

  const addEventListeners = () => {
    logger.debug('add event listeners for mousemove, scroll, and keydown')
    const opt = {
      leading: false,
      trailing: true,
    }
    const timeout = 400

    window.onmousemove = throttle(resetDelay, timeout)
    window.onscroll = throttle(resetDelay, timeout, opt)
    window.onkeydown = throttle(resetDelay, timeout)
    window.onclick = throttle(resetDelay, timeout, opt)
  }

  const removeEventListeners = () => {
    logger.debug('remove event listeners for mousemove, scroll, and keydown')
    window.onmousemove = null
    window.onscroll = null
    window.onkeydown = null
  }

  const resetDelay = () => {
    console.debug('reset inactivityDelay')
    setInactivityDelay(null)
    setInactivityDelay(Number(router.query.timeout) || delay)
  }

  const handleExpirePatientTimerCountdown = async () => {
    logger.debug('Patient session is idle')
    await stopTrackingTimeSpent(timerID)
    await signOut({ redirect: false, callbackUrl: '/auth/signin' })
  }

  const startTrackingTimeSpent = async () => {
    /*
      start the timer UI here.
      If the request to start it fails on the backend, this 
      will be set to false and the timer will dissapear. Ideally 
      we would enable/disable the timer based on whether or not 
      this patient is billable but the API does not provide a 
      means to determine this without first making a call to 
      the /visits API
    */

    return await axios
      .post(
        `${env('PUBLIC_ALUNA_API')}/patients/${pid}/visits`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        logger.debug(
          `✅ The timer is now running on the backend for
          ${env('PUBLIC_ALUNA_API')}/patients/${pid}/visits `,
          response
        )

        // Kickoff the timer
        // Rely on this success response of POST ${pid}/visits
        // to determine if the timer needs to be initiated
        setInactivityDelay(Number(router.query.timeout) || delay)

        dispatch({
          type: 'SET_TIMER_RUNNING',
          payload: {
            running: true,
            stopTimer: () => stopTrackingTimeSpent(timerIDRef.current),
            visitId: response.data._id || null,
          },
        })

        addEventListeners()
        setTimerID(response.data._id)
      })
      .catch((error) => {
        logger.error('error.response: ', error.response)
        setInactivityDelay(null)
        removeEventListeners()
        setUserBillable(false)
      })
  }

  const stopTrackingTimeSpent = async (patientTimerID: string) => {
    logger.debug(`make an API call to stop the timer: ${router.asPath}`)
    logger.debug('patientTimerID', patientTimerID)

    // stops the frontend timer component in the header
    dispatch({
      type: 'SET_TIMER_RUNNING',
      payload: { running: false },
    })

    setInactivityDelay(null)
    removeEventListeners()

    // Use native fetch for easier use of keepalive
    // (necessary for /visits/[visitId] to complete a POST onbeforeunload)
    return await fetch(
      `${env('PUBLIC_ALUNA_API')}/patients/${pid}/visits/${patientTimerID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }
    )
      .then((response) => {
        logger.debug(
          `  ✅✅ successful stopTimer response from ${env(
            'PUBLIC_ALUNA_API'
          )}/patients/${pid}/visits/${patientTimerID}:`,
          response
        )
        dispatch({
          type: 'SET_TIMER_RUNNING',
          payload: { running: false },
        })
      })
      .catch((error) => {
        logger.error('stopTimer error in response: ', error)
      })
  }

  useEffect(() => {
    !isNil(accessToken) &&
      !state.timer.running &&
      userBillable &&
      startTrackingTimeSpent()
  }, [accessToken])

  /* ==========================================================================================
   * Extreme Danger Zone!!!
   * The following useEffect hook is full of hacks intended
   * to get Chrome, Safari, and FF to do what is necessary under specific unload cases:
   * refresh, close tab, inactivity timeout, logout, navigate to another app view.
   * The order of each of the following statements matters and will break un-testable
   * user flows if altered without close consultation from the team.
   * ======================================================================================= */
  useEffect(() => {
    // Capture timerID in a ref so that it is available on unmount
    // If accessToken is ready, setup the onbeforeunload which fires
    // when the browser tab is closed
    // @ts-ignore
    timerIDRef.current = timerID

    if (accessToken && userBillable) {
      window.onbeforeunload = (event) => {
        // Safari and Chrome do not prompt as they simply use keepAlive in stopTrackingTimeSpent
        // to update the visits API. Firefox has not implemented keepAlive so we must prompt in
        // order to ensure that the request has a chance to go through.

        // stopTrackingTimeSpent records the patient visit length via an API call.
        logger.debug('onbeforeunload:stopTrackingTimeSpent started', event)
        stopTrackingTimeSpent(timerID)

        // If a dialog is present and one of the options is selected (only on Firefox)
        // this timeout will execute and get the timer running again. Chrome and Safari
        // do not require this behavior.
        window.setTimeout(() => {
          startTrackingTimeSpent()
        }, 100)

        // Make sure this does not stick around in FF due to early return
        window.onbeforeunload = null

        if (isFirefox) {
          // Firefox always shows the confirm if preventDefault is called
          event.preventDefault()
          return ''
        }

        // If Safari else 'some other' broswer (Chrome)
        return isSafari ? null : undefined
      }

      return () => {
        window.onbeforeunload = null
      }
    }
  }, [timerID, accessToken])
  /* ==========================================================================================
   * End Extreme Danger zone!!!
   * ======================================================================================= */

  // listen for page activity only if there is an accessToken
  useEffect(() => {
    if (accessToken && userBillable) {
      return () => {
        stopTrackingTimeSpent(timerIDRef.current)
        removeEventListeners()
      }
    }
  }, [accessToken])

  // End Timer related methods
  // -----------------------------------------------------------------------

  //if (patientError) return <pre>{JSON.stringify(patientError, null, 2)}</pre>

  return (
    <>
      <Feedback />
      {patient && (
        <>
          <Drawer
            open={leftDrawerOpen}
            handleToggleDrawer={handleToggleLeftDrawer}
            sx={{
              zIndex: 1,
              position: 'absolute',
            }}
            attachedToMainNav
          >
            <PatientHistoryStepper patient={patient} />
          </Drawer>

          <Drawer
            open={rightDrawerOpen}
            handleToggleDrawer={handleToggleRightDrawer}
            anchor="right"
          >
            {rightDrawerOpen && (
              <PatientGraphDetail day={rightDrawerDay} pid={pid} />
            )}
          </Drawer>

          <Box
            component="main"
            sx={{
              ...(leftDrawerOpen && {
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
                marginLeft: {
                  sm: `${DRAWER_WIDTH_SM}px`,
                  xl: `${DRAWER_WIDTH}px`,
                },
              }),
              ...(rightDrawerOpen && {
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
                marginRight: {
                  sm: `${DRAWER_WIDTH_SM}px`,
                  xl: `${DRAWER_WIDTH}px`,
                },
              }),
              pl: 6,
              pt: 5,
              pr: 5,

              [theme.breakpoints.down('lg')]: {
                pl: 3,
                pt: 3,
                pr: 3,
              },

              ...(leftDrawerOpen &&
                rightDrawerOpen && {
                  pl: 4,
                  pt: 3,
                  pr: 2,
                }),
            }}
          >
            {!leftDrawerOpen && (
              <ToggleArrowRight>
                <IconButton onClick={handleToggleLeftDrawer} aria-label="close">
                  <KeyboardArrowRightIcon />
                </IconButton>
              </ToggleArrowRight>
            )}

            <PateientDetailHeader patient={patient} medications={medications} />

            <Grid container spacing={2} sx={{ mb: 6, mt: 2 }}>
              <Grid item xs={12}>
                <ContentBlock sx={{ minWidth: '450px' }}>
                  <PatientStats
                    pid={pid}
                    // TODO: fix confusing naming here
                    setRightDrawerOpen={setRightDrawerContent}
                    closeRightDrawer={() => {
                      setRightDrawerOpen(false)
                    }}
                  />
                </ContentBlock>
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      <Dialog open={isIdle} maxWidth="xs">
        <DialogTitle>
          <Typography variant="h1" component="div">
            Session Timeout
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography>
            You are being timed-out due to inactivity. Please choose to stay
            signed in or to logoff. Otherwise, you will be logged off
            automatically.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            data-cy="patientActivityContinue"
            variant="contained"
            onClick={() => {
              resetDelay()
              setIsIdle(false)
            }}
          >
            Continue (
            <CountDownTimer
              expiryTimestamp={billingSessionTimeout}
              handleExpire={handleExpirePatientTimerCountdown}
            />
            )
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

Patient.layout = 'fullScreenRelative'
Patient.auth = true
export default Patient
