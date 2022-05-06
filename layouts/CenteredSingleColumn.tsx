import React from 'react'
import Head from 'next/head'
import { Grid } from '@mui/material'
import useMounted from '../hooks/useMounted'

const CenteredSingleColumn = (props) => {
  const mounted = useMounted()
  return (
    mounted && (
      <>
        <Head>
          <title>Aluna Dashboard</title>
          <meta charSet="utf-8" />
        </Head>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          component="main"
          sx={{ height: '100vh', background: 'white' }}
        >
          <Grid
            item
            sx={{
              maxWidth: '410px!important',
              height: '100vh',
            }}
          >
            {props.children}
          </Grid>
        </Grid>
      </>
    )
  )
}

export default CenteredSingleColumn
