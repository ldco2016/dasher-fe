import React from 'react'
import Head from 'next/head'
import { Grid } from '@mui/material'
import { styled } from '@mui/system'

const GridStyle = styled<any>(Grid)(() => ({
  height: '100vh',
  background: 'white',
  justifyContent: 'center',
}))

const BasicLayout = (props) => {
  return (
    <>
      <Head>
        <title>Aluna Dashboard</title>
        <meta charSet="utf-8" />
      </Head>
      <GridStyle container component="main">
        {props.children}
      </GridStyle>
    </>
  )
}

export default BasicLayout
