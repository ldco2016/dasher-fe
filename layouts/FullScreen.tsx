import React from 'react'
import Head from 'next/head'
import AppContainer from '../components/AppContainer'
import { styled } from '@mui/system'

const Content = styled('main')(() => ({
  flexGrow: 1,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  height: `calc(100vh - 65px)`,
  background: 'white',
}))

const FullScreen = (props) => {
  return (
    <>
      <Head>
        <title>Aluna Dashboard</title>
        <meta charSet="utf-8" />
      </Head>
      <AppContainer>
        <Content>{props.children}</Content>
      </AppContainer>
    </>
  )
}

export default FullScreen
