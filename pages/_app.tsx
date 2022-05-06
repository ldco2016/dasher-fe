import React, { useState, useEffect, useReducer } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import Theme from 'constants/theme'
import { Provider, getSession, useSession, signIn } from 'next-auth/client'
import { SWRConfig } from 'swr'
import LayoutWrapper from 'layouts/layout-wrapper'
import { useRouter } from 'next/router'
import moment from 'moment'
import { LinearLoader } from 'components/loaders'
import { AppContextWrapper } from 'context'
import * as ga from 'libs/ga'
import { useAppContext } from 'context'
import useMounted from 'hooks/useMounted'

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

const DashboardApp = ({ Component, pageProps }) => {
  const router = useRouter()
  const mounted = useMounted()
  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  if (mounted)
    return (
      <>
        <Provider
          session={pageProps.session}
          options={{
            clientMaxAge: 60, // Re-fetch session if cache is older than 60 seconds
            keepAlive: 5 * 60, // Send keepAlive message every 5 minutes
          }}
        >
          <SWRConfig
            value={{
              fetcher: fetch, // For AR-352, changed from using default fetch to isomorphic-unfetch
              onError: (err) => {
                console.error('SWR Error: ', err)
              },
            }}
          >
            <AppContextWrapper>
              <ThemeProvider theme={Theme}>
                <CssBaseline />
                {Component.auth ? (
                  <Auth>
                    <LayoutWrapper {...pageProps}>
                      <Component {...pageProps} />
                    </LayoutWrapper>
                  </Auth>
                ) : (
                  <LayoutWrapper {...pageProps}>
                    <Component {...pageProps} />
                  </LayoutWrapper>
                )}
              </ThemeProvider>
            </AppContextWrapper>
          </SWRConfig>
        </Provider>
      </>
    )
  return null
}

// setting hasMounted makes sure that SSG and SSR content
// matches the CSR content durning rehydration. If the DOM is
// different, warnings will appear in the console and events
// might not attach correctly in rare cases. We can extract hasMounted
// into a hook if we end up using it in other areas of the app.
// import useMounted from '../hooks/useMounted'
function Auth({ children }) {
  const [session, loading] = useSession()
  const mounted = useMounted()
  const [nextLoggedOutDueToTimeout, setNextLoggedOutDueToTimeout] =
    useState(null)
  const router = useRouter()
  const { dispatch } = useAppContext()

  useEffect(() => {
    fetch('/api/get-token/', {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => response.json())
      .then((tokenResponseJson) =>
        dispatch({
          type: 'SET_TOKEN',
          payload: tokenResponseJson,
        })
      )
      .catch((err) => err)
  }, [])

  useEffect(() => {
    if (session?.expires) {
      setNextLoggedOutDueToTimeout(moment.utc(session.expires)) //.add(5, 'minute')
    }
  }, [session, session?.expires])

  useEffect(() => {
    if (loading) return // Do nothing while loading

    const validSession = !!session?.user
    if (!validSession) {
      if (
        !nextLoggedOutDueToTimeout ||
        moment.utc().isBefore(nextLoggedOutDueToTimeout)
      ) {
        signIn() // If not authenticated, force log in
      } else {
        router.replace({
          pathname: '/auth/signin',
          query: { reason: 'expired' },
        })
      }
    }
  }, [session, loading])

  if (!!session?.user && mounted) return children

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  if (mounted) return <LinearLoader />

  return null
}

export default DashboardApp
