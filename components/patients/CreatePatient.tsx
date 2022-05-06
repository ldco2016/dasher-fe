import React, { useState } from 'react'
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import AdapterMoment from '@mui/lab/AdapterMoment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import useSWR from 'swr'
import { styled, useTheme } from '@mui/system'
import fetch from 'libs/fetch'
import { useForm, Controller } from 'react-hook-form'
import { INewPatient } from 'types'
import env from '@beam-australia/react-env'

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
  flexGrow: 1,
}))

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

const CreatePatient = ({ hideDrawer }: INewPatient) => {
  const [dob, setDob] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  const theme = useTheme()

  // TODO: when/if this component is added back into the UI
  // use the new token fetching hook:
  // const { data, error } = useSWRWithToken(`/api/endpoint`)
  const { data: token } = useSWR<any>(`/api/get-token/`, fetch)

  const onSubmit = async (data) => {
    // console.log('data: ', data)
    // console.log('token: ', token)
    let myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${token?.accessToken}`)

    myHeaders.append('Content-Type', 'application/json')
    const raw = JSON.stringify({
      pui: data.pui,
      dob: data.dob._d,
      heightInInches: data.heightInInches,
      ethnicity: data.ethnicity,
      gender: data.gender,
      deviceIds: data.deviceIds,
      phone: data.phone,
      fax: data.fax,
    })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    }
    const newUser = await fetch(
      `${env('PUBLIC_ALUNA_API')}/patients`,
      requestOptions
    )
      .then((result) => {
        console.log('result', result)
        hideDrawer()
      })
      .catch((error) => console.log('error', error))
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Create Patient
      </Typography>
      <Form noValidate method="post" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="pui"
          rules={{
            required: 'pui required',
            maxLength: { value: 20, message: 'max length is 20' },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              size="small"
              onChange={onChange}
              data-cy="pui"
              variant="outlined"
              margin="normal"
              fullWidth
              name="pui"
              label="pui"
              placeholder="existing aluna user id"
              type="text"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <Controller
          control={control}
          name="dob"
          rules={{
            required: 'birth date is required',
          }}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="birth date"
                value={dob}
                onChange={(dob) => {
                  setDob(dob)
                  setValue('dob', dob, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    onChange={onChange}
                    size="small"
                    sx={{ mb: 1 }}
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />

        <Controller
          control={control}
          name="heightInInches"
          rules={{
            required: 'Height is required',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              size="small"
              sx={{ marginTop: theme.spacing(0) }}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              data-cy="heightInInches"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="heightInInches"
              label="height"
              placeholder="height in inches"
              type="number"
            />
          )}
        />

        <Controller
          control={control}
          name="ethnicity"
          rules={{
            required: 'Ethnicity required',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              sx={{ mb: 1, width: '100%' }}
              error={error ? true : false}
            >
              <CustomInputLabel htmlFor="control-level-select-label">
                Ethnicity
              </CustomInputLabel>
              <Select
                labelId="ethnicity-select-label"
                id="ethnicity"
                value={value}
                label="Ethnicity"
                autoWidth
                size="small"
                error={!!error}
                onChange={onChange}
              >
                <MenuItem value="Hispanic">Hispanic</MenuItem>
                <MenuItem value="White">White</MenuItem>
                <MenuItem value="Asian">Asian</MenuItem>
                <MenuItem value="Black">Black</MenuItem>
                <MenuItem value="Multiple ethnic groups">
                  Multiple ethnic groups
                </MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {error ? <FormHelperText>{error.message}</FormHelperText> : null}
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="gender"
          rules={{
            required: 'Gender required',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              sx={{ mb: 1, width: '100%' }}
              error={error ? true : false}
            >
              <CustomInputLabel htmlFor="control-level-select-label">
                Gender
              </CustomInputLabel>
              <Select
                labelId="gender-select-label"
                id="gender"
                value={value}
                label="Gender"
                autoWidth
                size="small"
                error={!!error}
                onChange={onChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {error ? <FormHelperText>{error.message}</FormHelperText> : null}
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="deviceIds"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              sx={{ marginTop: theme.spacing(0) }}
              size="small"
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              data-cy="deviceIds"
              variant="outlined"
              margin="normal"
              fullWidth
              name="deviceIds"
              label="Device IDs"
              placeholder="device ids (should be a multi input)"
              type="text"
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              sx={{ marginTop: theme.spacing(0) }}
              size="small"
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              data-cy="phone"
              variant="outlined"
              margin="normal"
              fullWidth
              name="phone"
              label="Phone"
              placeholder="(555) 555-5555"
              type="phone"
            />
          )}
        />

        <Controller
          control={control}
          name="fax"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              sx={{ marginTop: theme.spacing(0) }}
              size="small"
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              data-cy="fax"
              variant="outlined"
              margin="normal"
              fullWidth
              name="fax"
              label="fax"
              placeholder="(555) 555-5555"
              type="phone"
            />
          )}
        />

        <Button type="submit" fullWidth variant="contained" color="primary">
          Create Patient
        </Button>
      </Form>
    </>
  )
}

export default CreatePatient
