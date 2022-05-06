import React, { useEffect, useState } from 'react'
import PhoneNumberField from 'components/forms/PhoneNumberField'
import { useRouter } from 'next/router'
import {
  Typography,
  TextField,
  Button,
  Link,
  Box,
  LinearProgress,
  Alert,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Checkbox,
} from '@mui/material'
import AlunaLogo from 'public/images/logo_white.svg'

import { useForm, Controller, FormProvider } from 'react-hook-form'
import { Container, FormStyle, LegalBlurb } from 'components/forms/auth'
import ControlledTextField from 'components/forms/ControlledTextField'
import { signOut, useSession } from 'next-auth/client'
import env from '@beam-australia/react-env'
import { isNil } from 'lodash'

// TODO add privacy and terms acceptance
function Register({ csrfToken, referer }) {
  const [session, loading] = useSession()
  const router = useRouter()
  const { tkn } = useRouter().query

  const [userFromToken, setUserFromToken] = useState({ firstname: null })
  const [validUserToken, setValidUserToken] = useState(true)
  const [pui, setPui] = useState(null)
  const [token, setToken] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const methods = useForm({ mode: 'onChange' })
  const {
    handleSubmit,
    watch,
    control,
    register,
    formState: { errors },
    reset,
  } = methods

  const [error, setError] = useState(null)
  const password = {}

  password.current = watch('password', '')

  useEffect(() => {
    if (session) {
      signOut({ redirect: false })
    }
  }, [tkn, session])

  useEffect(async () => {
    // console.log('PUBLIC_ALUNA_API', env('PUBLIC_ALUNA_API'))
    if (tkn && !session) {
      const tokenResponse = await fetch(
        `${env('PUBLIC_ALUNA_API')}/auth/login`,
        {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ tkn }),
        }
      )
        .then((response) => {
          return response.json()
        })
        .catch((error) => {
          console.warn('tokenResponse fetch error', error)
          return {
            token: null,
            pui: null,
          }
        })

      if (isNil(tokenResponse.token)) {
        console.warn('token response failed', tokenResponse)
      }
      setToken(tokenResponse.token)
      setPui(tokenResponse.pui)

      const tokenUser = await fetch(
        `${env('PUBLIC_ALUNA_API')}/auth/users/${tokenResponse.pui}`,
        {
          method: 'GET',
          headers: new Headers({
            Authorization: `Bearer ${tokenResponse.token}`,
            'Content-Type': 'application/json',
          }),
        }
      )
        .then((response) => {
          return response.json()
        })
        .catch((error) => {
          console.warn('tokenUser fetch error', error)
          return null
        })

      setValidUserToken(!isNil(tokenUser))
      if (isNil(tokenUser)) {
        // When this occurs, we're going to change the form contents.
        const invalid = '[Invalid]' // When this happens we need to change the view.
        reset({
          firstName: invalid,
          lastName: invalid,
          email: invalid,
          phone: '',
        })
      } else {
        // console.log('tokenUser: ', tokenUser)
        const { firstName, middleName, lastName, credentials } = tokenUser

        reset({
          firstName,
          middleName,
          lastName,
          email: credentials[0].email,
          phone: '',
        })
        setUserFromToken(tokenUser)
      }
    }
  }, [router.query])

  const onSubmit = async (data) => {
    if (data.privacy !== true) {
      console.warn('Missing Privacy')
      setError('Missing Privacy Policy Acceptance')
      return
    }
    if (data.terms !== true) {
      console.warn('Missing terms')
      setError('Missing Terms of Service')
      return
    }

    const passwordResponsePromise = await fetch(
      `${env('PUBLIC_ALUNA_API')}/auth/users/${pui}/password`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          pui: pui,
          newPassword: data.password,
          email: userFromToken.credentials[0].email,
          terms: data.terms === true, // Note: These are the slated names per Pablo, 10/04/21, subject to change
          privacy: data.privacy === true,
        }),
      }
    )
      .then((response) => {
        if (response.ok === false) {
          return response.text()
        } else {
          return response
        }
      })
      .catch((error) => console.log('error', error))

    const parsedPasswordResponse = passwordResponsePromise

    if (parsedPasswordResponse.status !== 200) {
      setError(parsedPasswordResponse.message)
    }

    if (parsedPasswordResponse.status === 200) {
      await router.push({
        pathname: '/auth/signin',
        query: { email: userFromToken.credentials[0].email },
      })
      setPasswordSuccess(true)
      setError(null)
    }
  }

  return (
    <>
      {session && (
        <Container>
          please [log out] (logout link here) of the Aluna dashboard to register
          a new user.
        </Container>
      )}
      {!session && (
        <Container>
          {loading && <LinearProgress color="secondary" />}

          <Box sx={{ flexGrow: !validUserToken ? 0.25 : 1 }} />
          <AlunaLogo />
          <Box sx={{ flexGrow: !validUserToken ? 0.25 : 1 }} />

          {passwordSuccess && (
            <>
              <Typography variant="h1" sx={{ mb: 2 }}>
                Your password has been set!
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  router.push('/signin')
                }}
              >
                Sign in to the Aluna dashboard
              </Button>
            </>
          )}

          {!validUserToken ? (
            <>
              <Typography
                data-cy="expired-invitations"
                variant="h1"
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                Your invitation has expired.
              </Typography>
              <Typography variant={'body2'} sx={{}}>
                <Link href="mailto:providers@alunacare.com">
                  Please contact customer service.
                </Link>
              </Typography>
            </>
          ) : null}

          {validUserToken && userFromToken && (
            <>
              {!passwordSuccess && (
                <>
                  {/* TODO: make this h1 a theme variant */}
                  <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    <Box sx={{ fontWeight: 'bold', mb: 2 }}>
                      New Aluna Account for
                    </Box>
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <FormProvider {...methods}>
                    <FormStyle
                      noValidate
                      method="post"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Box sx={{ display: 'flex' }}>
                        <ControlledTextField
                          name="firstName"
                          disabled
                          label="First Name"
                          value="foo"
                          sx={{ mr: 1.5 }}
                        />
                        <ControlledTextField
                          name="middleName"
                          disabled
                          label="Middle Name"
                          required={false}
                        />
                      </Box>
                      <ControlledTextField
                        name="lastName"
                        disabled
                        label="Last Name"
                      />
                      <ControlledTextField
                        name="email"
                        disabled
                        label="Email"
                      />
                      <PhoneNumberField
                        name="phone"
                        label="Phone"
                        disabled={true}
                        required={false}
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
                            sx={{ mt: 1 }}
                            size="small"
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            data-cy="password"
                            variant="outlined"
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
                            value === password.current ||
                            'The passwords do not match',
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            sx={{ mb: 2 }}
                            size="small"
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            data-cy="verifypassword"
                            variant="outlined"
                            margin="dense"
                            required
                            fullWidth
                            name="verifypassword"
                            label="Re-Enter Password"
                            type="password"
                            autoComplete="current-password"
                          />
                        )}
                      />
                      <Box sx={{ m: 2 }}>
                        <Controller
                          control={control}
                          name="privacy"
                          rules={{
                            required: true,
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error, invalid },
                          }) => (
                            <FormControl
                              required
                              error={error}
                              variant="standard"
                            >
                              <FormControlLabel
                                onChange={onChange}
                                control={
                                  <Checkbox required={true} name="privacy" />
                                }
                                label={
                                  <>
                                    I agree to the{' '}
                                    <Link href="/legal/privacy">
                                      Privacy Policy
                                    </Link>
                                  </>
                                }
                              />
                              <FormHelperText>
                                The <strong>privacy policy</strong> must be
                                accepted to proceed.
                              </FormHelperText>
                            </FormControl>
                          )}
                        />
                        &nbsp;
                        <Controller
                          control={control}
                          name="terms"
                          rules={{
                            required: true,
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              required
                              error={error}
                              variant="standard"
                            >
                              <FormControlLabel
                                onChange={onChange}
                                control={<Checkbox name="terms" />}
                                label={
                                  <>
                                    I agree to the{' '}
                                    <Link href="/legal/terms">
                                      Terms of Use
                                    </Link>
                                  </>
                                }
                              />
                              <FormHelperText>
                                The <strong>Terms of Use</strong> policy must be
                                accepted to continue.
                              </FormHelperText>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Button
                        type="submit"
                        data-cy="register-client-user-submit-button"
                        fullWidth
                        variant="contained"
                        color="primary"
                      >
                        Sign Up
                      </Button>
                    </FormStyle>
                  </FormProvider>
                </>
              )}
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <LegalBlurb />
        </Container>
      )}
    </>
  )
}

Register.layout = 'centeredSingleColumn'
export default Register
