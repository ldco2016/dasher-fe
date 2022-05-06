import React, { useState } from 'react'
import axios from 'axios'
import {
  Typography,
  Box,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import PhoneNumberField from '../forms/PhoneNumberField'
import useSWR, { mutate } from 'swr'

import { useTheme, styled } from '@mui/system'
import fetch from 'libs/fetch'
import { useForm, FormProvider } from 'react-hook-form'
import ControlledTextField from '../forms/ControlledTextField'
import { GeneralObject, INewClinic } from 'types'
import env from '@beam-australia/react-env'

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: 1,
  flexGrow: 1,
}))

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

type FormValues = {
  name: string
  ein: string
  phone: string
  fax?: string
  adminTitle?: string
  adminFirstName: string
  adminMiddleName?: string
  adminLastName: string
  adminEmail: string
  adminPhone?: string
  adminFax?: string
  adminNpi?: number
  adminInvitationTags: [GeneralObject]
}

const CreateClinic = ({
  hideDrawer,
  optimisticallyUpdateClinics,
}: INewClinic) => {
  const methods = useForm<FormValues>({ mode: 'onChange' })
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [clinicCreateError, setClinicCreateError] = useState(null)

  // TODO: when/if this component is added back into the UI
  // use the new token fetching hook:
  // const { data, error } = useSWRWithToken(`/api/endpoint`)
  const { data: token } = useSWR<any>(`/api/get-token/`, fetch)

  const onSubmit = (data) => {
    console.log('Create Clinic data: ', data)
    setClinicCreateError(null)
    setLoading(true)
    const {
      name,
      ein,
      phoneStripped,
      fax,
      adminTitle,
      adminFirstName,
      adminMiddleName,
      adminLastName,
      adminEmail,
      adminPhoneStripped,
      adminFax,
      adminNpi,
    } = data

    const formData = {
      name,
      ein,
      phone: phoneStripped,
      fax,
      adminTitle,
      adminFirstName,
      adminMiddleName,
      adminLastName,
      adminEmail,
      adminPhone: adminPhoneStripped,
      adminFax,
      adminNpi,
      // Hard coded for current API version,
      // this will be expanded for different types of registrations
      adminInvitationTags: [
        {
          key: 'workflow',
          value: 'adminRegistration',
        },
      ],
    }

    // calls the parent component which spreads it with clinics
    optimisticallyUpdateClinics({
      highlight: true,
      name,
      phone: phoneStripped,
      healthWorkers: [],
    })

    // TODO: refactor to use axios throughout app for simplicity
    // (native fetch requires more boilerplate to parse responses)
    axios(`${env('PUBLIC_ALUNA_API')}/organizations`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(formData),
    })
      .then(function (response) {
        console.log('rest', response)
        mutate([`${env('PUBLIC_ALUNA_API')}/organizations`, token?.accessToken])
        hideDrawer()
      })
      .catch(function (error) {
        console.log('error.response.data: ', error.response.data.message)
        setClinicCreateError(error.response.data.message)
      })

    setLoading(false)
  }

  return (
    <FormProvider {...methods}>
      <Form
        data-cy="create-clinic-drawer-form"
        noValidate
        method="post"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Box>
          <Typography id="modal-modal-title" variant="h1">
            Add New Clinic
          </Typography>

          {clinicCreateError && (
            <Alert sx={{ mt: 1, mb: 2 }} severity="error">
              {clinicCreateError}
            </Alert>
          )}

          <ControlledTextField
            name="name"
            label="Clinic Name"
            placeholder="name of clinic"
            rules={{ required: 'clinic name required' }}
            sx={{ mt: 2 }}
          />

          <ControlledTextField
            name="ein"
            cy-data="clinic-form-text-clinic-tax-id"
            label="Clinic Tax ID Number"
            type="text"
            rules={{
              required: '9 digit tax id required',
              pattern: {
                value: /\d{9}/gi,
                message: 'must be 9 digits',
              },
              minLength: { value: 9, message: 'must be 9 digits' },
              maxLength: { value: 9, message: "can't be more than 9 digits" },
            }}
          />

          <PhoneNumberField name="phone" label="Clinic Phone" />

          <Typography id="modal-modal-title" variant="h2" sx={{ mt: 3 }}>
            Add a Doctor
          </Typography>

          <Box sx={{ display: 'flex', mt: 1 }}>
            <ControlledTextField
              name="adminTitle"
              label="Title"
              sx={{ mr: 1.5 }}
              required={false}
            />

            <ControlledTextField
              name="adminFirstName"
              label="First Name"
              rules={{ required: 'admin user name required' }}
              sx={{ mr: 1.5 }}
            />
            <ControlledTextField
              name="adminMiddleName"
              label="Middle Name"
              required={false}
            />
          </Box>
          <ControlledTextField
            name="adminLastName"
            label="Last Name"
            rules={{
              required: 'admin last name required',
            }}
          />
          <ControlledTextField
            name="adminEmail"
            label="Email Address"
            rules={{
              required: 'admin Email required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            }}
          />
          <PhoneNumberField
            name="adminPhone"
            label="Admin Phone"
            required={false}
          />

          <ControlledTextField
            name="adminNpi"
            label="Doctor's NPI"
            type="text"
            required={false}
            cy-data="clinic-form-text-clinic-doctor-npi"
            rules={{
              pattern: {
                value: /\d{10}/gi,
                message: 'must be 10 digits',
              },
              minLength: { value: 10, message: 'must be 10 digits' },
              maxLength: { value: 10, message: "can't be more than 10 digits" },
            }}
          />

          <FormControl sx={{ mt: 2, mb: 2, width: '100%', opacity: 0.5 }}>
            <CustomInputLabel htmlFor="role-select-label">
              User Role
            </CustomInputLabel>
            <Select label="User Role" value="Admin / Doctor" disabled={true}>
              <MenuItem value="Admin / Doctor">Admin / Doctor</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <br />

        {/* TODO: clean this up/ move to styled component */}
        <Box
          sx={{
            display: 'flex',
            position: 'sticky',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'white',
            pt: 2,

            pb: theme.spacing(2),

            borderTop: '1px solid #ccc',
            zIndex: 100,
          }}
        >
          <Button
            onClick={hideDrawer}
            variant="outlined"
            size="large"
            sx={{ mr: 1, flexGrow: 1 }}
          >
            Cancel
          </Button>

          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ flexGrow: 2 }}
          >
            Send Invitation
          </LoadingButton>
        </Box>
      </Form>
    </FormProvider>
  )
}

export default CreateClinic
