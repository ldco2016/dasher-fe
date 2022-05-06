import React, { useState } from 'react'
import { InputLabel, Typography, Divider, Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { styled, useTheme } from '@mui/system'
import { useForm, FormProvider } from 'react-hook-form'
import ControlledTextField from '../forms/ControlledTextField'
import PhoneNumberField from '../forms/PhoneNumberField'
import DateField from '../forms/DateField'
import AddressFields from '../forms/AddressFields'

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))
const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: 1,
  flexGrow: 1,
}))

// TODO: type this mockup
const AddPatientsForm = ({ handeleSubmit }) => {
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      state: '',
    },
  })
  const onSubmit = async (data) => {
    console.log('data=: ', data)
    handeleSubmit()
  }
  return (
    <>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Add a Single Patient
      </Typography>
      <FormProvider {...methods}>
        <Form
          noValidate
          method="post"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              mb: 2,
            }}
          >
            <Typography variant="h3" sx={{ mt: 4, mb: 1 }}>
              Personal Details
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="firstName"
                label="First Name"
                rules={{ required: 'first name required' }}
                sx={{ mr: 1 }}
              />
              <ControlledTextField
                name="lastName"
                label="Last Name"
                rules={{
                  required: 'last name required',
                }}
                sx={{ mr: 1 }}
              />
              <DateField name="dob" label="DOB" />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="email"
                label="Email"
                sx={{ mr: 1 }}
                rules={{
                  required: 'Email required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format',
                  },
                }}
              />

              <PhoneNumberField name="phone" label="Phone Number" />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="emr"
                label="EMR Number"
                rules={{
                  required: 'EMR Number required',
                }}
                sx={{ mr: 1 }}
              />
              <ControlledTextField
                name="icdCodes"
                label="ICD-10 Code(s)"
                rules={{
                  required: 'ICD-10 Code required',
                }}
                sx={{ mr: 1 }}
              />
              <DateField
                name="nextAppointment"
                required={false}
                label="Next Appointment Date"
              />
            </Box>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <AddressFields type="home" showNotes={false} billingCheck={false} />
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Insurance
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="payer"
                label="Payer"
                rules={{ required: 'insurer required' }}
                sx={{ mr: 1 }}
              />
              <PhoneNumberField
                name="payerPhone"
                required={false}
                label="Payer Phone Number"
              />
              <ControlledTextField
                name="label"
                label="Label"
                required={false}
                sx={{ ml: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="memberID"
                label="Member ID"
                sx={{ mr: 1 }}
                rules={{ required: 'member ID required' }}
              />

              <ControlledTextField
                name="groupID"
                label="Group ID"
                required={false}
                sx={{ mb: 2 }}
              />
            </Box>

            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Submit
            </LoadingButton>
          </Box>
        </Form>
      </FormProvider>
    </>
  )
}

export default AddPatientsForm
