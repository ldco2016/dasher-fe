import { useSession, signIn } from 'next-auth/client'
import React, { useEffect, useState } from 'react'
import { getCsrfToken } from 'next-auth/client'
import { useRouter } from 'next/router'
import {
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material'

// @ts-ignore
import AlunaLogo from 'public/images/logo_white.svg'

import { useTheme } from '@mui/material/styles'
import {
  Container,
  FormStyle,
  LegalBlurb,
  AuthHelperText,
} from 'components/forms/auth'
import { GeneralObject } from 'types'

function SignIn({ csrfToken, referer }) {
  const [session, loading] = useSession()
  const router = useRouter()

  const {
    email: integrationEmail,
    credentialType: integrationCredentialType,
    patientId: integrationPatientId,
    token: integrationToken,
    error,
  } = useRouter().query

  const theme = useTheme()

  const [email, setEmail] = useState(
    router.query.email ? decodeURIComponent(router.query.email.toString()) : ''
  )
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (integrationEmail && integrationCredentialType) {
      signIn('integration-login', {
        csrfToken,
        email,
        credentialType: integrationCredentialType,
        token: integrationToken,
        callbackUrl: `${window.location.origin}/patients${
          !!integrationPatientId ? `/${integrationPatientId}` : ''
        }`,
      })
    }
  }, [])

  useEffect(() => {
    if (session) router.push(`/`)
  }, [session])

  const updateEmail = (e) => {
    setEmail(e.target.value)
  }
  const updatePassword = (e) => {
    setPassword(e.target.value)
  }
  const onFormSubmit = (e: any, provider: string, options: GeneralObject) => {
    e.preventDefault()
    signIn('credentials', {
      csrfToken,
      email,
      password,
      callbackUrl: `/`,
    })
  }

  return (
    <>
      {!session && (
        <Container>
          {loading && <LinearProgress color="secondary" />}

          <Box sx={{ flexGrow: 1 }} />
          <AlunaLogo />
          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Log in to Aluna
          </Typography>

          {router.query.reason === 'expired' ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Alert severity={'warning'}>Session Expired</Alert>
            </>
          ) : null}

          {error && (
            <Alert data-cy={'failed-auth'} severity="error">
              invalid username or password
            </Alert>
          )}

          <FormStyle noValidate>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextField
              defaultValue={email || ''}
              size="small"
              data-cy="email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              placeholder="user@email.com"
              autoComplete="username"
              onChange={updateEmail}
              type="email"
            />

            <TextField
              defaultValue={password}
              size="small"
              data-cy="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={updatePassword}
              sx={{ mb: theme.spacing(3) }}
            />
            <Button
              type="submit"
              onClick={(e) =>
                onFormSubmit(e, 'credentials', {
                  csrfToken,
                  email,
                  password,
                  callbackUrl: `/`,
                })
              }
              fullWidth
              variant="contained"
            >
              Log In
            </Button>

            <AuthHelperText />
          </FormStyle>
          <Box sx={{ flexGrow: 1 }} />
          <LegalBlurb />
        </Container>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

SignIn.layout = 'centeredSingleColumn'

export default SignIn
