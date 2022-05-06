import { useSession } from 'next-auth/client'
import React, { useEffect, useState } from 'react'
import { getCsrfToken } from 'next-auth/client'
import {
  Typography,
  TextField,
  Button,
  Link,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material'
import AlunaLogo from 'public/images/logo_white.svg'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import { styled, useTheme } from '@mui/system'
import env from '@beam-australia/react-env'

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
  flexGrow: 1,
}))

const Legal = styled(Box)(({ theme }) => ({
  fontSize: '.6rem',
  color: theme.palette.grey[600],
  textAlign: 'center',
}))

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 3,
  height: '100vh',
  padding: theme.spacing(2),
}))

const Submit = styled(Button)(() => ({
  color: 'white',
  textAlign: 'center',
}))

function SignUp({ csrfToken }) {
  const [session, loading] = useSession()
  const theme = useTheme()
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,

    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const [error, setError] = useState(null)
  const router = useRouter()
  const password = {}
  password.current = watch('password', '')

  const onSubmit = async (data) => {
    let myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      pui: data.pui,
      firstName: data.firstname,
      middleName: data.middlename,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    const newUser = await fetch(
      `${env('PUBLIC_ALUNA_API')}/auth/register`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let parsedResult = JSON.parse(result)
        console.log('parsedResult: ', parsedResult)
        if (parsedResult.credentials) {
          router.push(
            `/auth/signin?email=${encodeURIComponent(
              parsedResult.credentials[0].email
            )}`
          )
          return parsedResult
        } else {
          setError(parsedResult)
          throw Error(JSON.stringify(parsedResult))
        }
      })
      .catch((error) => console.log('error', error))
  }

  useEffect(() => {
    if (session) router.push(`/`)
  }, [session, loading])

  return (
    <>
      {!session && (
        <Container>
          {loading && <LinearProgress color="secondary" />}
          <div style={{ flexGrow: 1 }}></div>

          <AlunaLogo width="180" fill={theme.palette.secondary.main} />
          <Typography component="h1" variant="h5" alignItems="left">
            <Box sx={{ fontWeight: 'bold', mt: 8, mb: 2 }}>
              Sign Up for Aluna
            </Box>
          </Typography>
          {error?.message?.length && (
            <Alert severity="error">{error.message}</Alert>
          )}
          <Form noValidate method="post" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="pui"
              rules={{
                required: 'pui required',
                maxLength: { value: 20, message: 'max length is 20' },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  size="small"
                  onChange={onChange}
                  data-cy="pui"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="pui"
                  label="pui"
                  placeholder="pui"
                  type="text"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />

            <Controller
              control={control}
              name="firstname"
              rules={{
                required: 'First name is required',
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  sx={{ marginTop: theme.spacing(0) }}
                  size="small"
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  data-cy="firstame"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  placeholder="first name"
                  type="text"
                />
              )}
            />

            <Controller
              control={control}
              name="middlename"
              rules={{
                required: 'Middle name is required',
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  size="small"
                  sx={{ marginTop: theme.spacing(0) }}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  data-cy="middlename"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="middleName"
                  label="Middle Name"
                  placeholder="middle name"
                  type="text"
                />
              )}
            />
            <Controller
              control={control}
              name="lastname"
              rules={{
                required: 'Last name required',
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  sx={{ marginTop: theme.spacing(0) }}
                  size="small"
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  data-cy="lastname"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  placeholder="last name"
                  type="text"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  sx={{ marginTop: theme.spacing(0) }}
                  size="small"
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  data-cy="email"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email Address"
                  placeholder="email@domain.com"
                  type="email"
                />
              )}
            />

            {/* TODO: create a password verify component to abstract this */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'A password is required',
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  sx={{ marginTop: theme.spacing(0) }}
                  size="small"
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  data-cy="password"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              )}
            />

            <Controller
              control={control}
              name="verifypassword"
              rules={{
                required: 'Must verify password',
                validate: (value) =>
                  value === password.current || 'The passwords do not match',
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  sx={{ marginTop: theme.spacing(0) }}
                  size="small"
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  data-cy="verifypassword"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="verifypassword"
                  label="Re-Enter Password"
                  type="password"
                  autoComplete="current-password"
                />
              )}
            />

            <Submit type="submit" fullWidth variant="contained" color="primary">
              Sign Up
            </Submit>
            <Box sx={{ m: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Trouble logging in? <br />
                <Link href="/auth/signin" variant="body2">
                  Sign In
                </Link>{' '}
                or{' '}
                <Link
                  href={`${env('SUPPORT_EMAIL_PROVIDERS')}`}
                  variant="body2"
                >
                  {'Contact Support'}
                </Link>{' '}
              </Typography>
            </Box>
          </Form>

          <Legal>
            Aluna and the Aluna logo are trademarks of KNOX Medical Diagnostics,
            Inc.
          </Legal>
        </Container>
      )}
    </>
  )
}

//This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

SignUp.layout = 'centeredSingleColumn'
export default SignUp
