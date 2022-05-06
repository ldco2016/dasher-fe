import React from 'react'
import Head from 'next/head'
import AppContainer from '../components/AppContainer'
import { styled } from '@mui/system'
import Footer from '../components/Footer'

const ContentStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: 'white',
  padding: `${theme.spacing(4)} ${theme.spacing(4)} ${theme.spacing(
    6
  )} ${theme.spacing(6)}`,

  [theme.breakpoints.down('lg')]: {
    padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(
      6
    )} ${theme.spacing(5)}`,
  },

  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  height: `calc(100vh - 65px)`,
}))

const DefaultWhiteLayout = (props) => {
  return (
    <>
      <Head>
        <title>Aluna Dashboard</title>
        <meta charSet="utf-8" />
      </Head>
      <AppContainer>
        <ContentStyle>
          {props.children}
          {/* <Footer /> */}
        </ContentStyle>
      </AppContainer>
    </>
  )
}

export default DefaultWhiteLayout
