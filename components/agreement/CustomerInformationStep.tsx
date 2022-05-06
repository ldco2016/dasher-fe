import React from 'react'
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { styled } from '@mui/system'
import { ICustomerInformation } from 'types'

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

const CustomerInformationStep = ({ name }: ICustomerInformation) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  return (
    <>
      <Form
        noValidate
        method="post"
        sx={{
          display: 'block',
          maxWidth: 600,
          margin: '0 auto',
        }}
        onSubmit={() => console.log(`"form 1 captured`)}
      >
        <Controller
          control={control}
          name="clinicName"
          rules={{
            required: 'clinic name required',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              size="small"
              onChange={onChange}
              data-cy="clinicName"
              variant="outlined"
              margin="normal"
              required
              name="clinicName"
              label="Customer"
              placeholder="name of clinic"
              type="text"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              value="Allergy &amp; Asthma Associates"
            />
          )}
        />
        <div style={{ display: 'flex' }}>
          <Controller
            control={control}
            name="authorizedRepresentative"
            rules={{
              required: 'clinic name required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                size="small"
                sx={{ mr: 1, flexGrow: 2 }}
                onChange={onChange}
                data-cy="authorizedRepresentative"
                variant="outlined"
                margin="normal"
                required
                name="authorizedRepresentative"
                label="AUTHORIZED REPRESENTATIVE Name"
                placeholder="name"
                type="text"
                error={!!error}
                helperText={
                  error
                    ? error.message
                    : '(this individual must be legally authorized to bind the company)'
                }
              />
            )}
          />
          <Controller
            control={control}
            name="authorizedRepresentative"
            rules={{
              required: 'clinic name required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                size="small"
                sx={{ flexGrow: 1 }}
                onChange={onChange}
                data-cy="position"
                variant="outlined"
                margin="normal"
                required
                name="position"
                label="Position"
                placeholder="position"
                type="text"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <Controller
            control={control}
            name="address"
            rules={{
              required: 'address required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                sx={{
                  marginTop: 1,
                  marginRight: 1,
                  flexGrow: 1,
                }}
                size="small"
                onChange={onChange}
                data-cy="address"
                variant="outlined"
                margin="normal"
                name="address"
                label="Address"
                required
                placeholder="address"
                type="text"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            control={control}
            name="state"
            rules={{
              required: 'state required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl
                sx={{ mt: 1, mr: 1, width: 90 }}
                error={error ? true : false}
              >
                <CustomInputLabel htmlFor="state-select-label">
                  State
                </CustomInputLabel>
                <Select
                  labelId="state-select-label"
                  id="state"
                  value={value}
                  label="State"
                  required
                  autoWidth
                  size="small"
                  error={!!error}
                  onChange={onChange}
                >
                  <MenuItem value="AK">Alaska</MenuItem>
                  <MenuItem value="AL">Alabama</MenuItem>
                  <MenuItem value="AR">Arkansas</MenuItem>
                  <MenuItem value="...">...</MenuItem>
                </Select>
                {error ? (
                  <FormHelperText>{error.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="zip"
            rules={{
              required: 'zip required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                sx={{ marginTop: 1, width: 80 }}
                size="small"
                onChange={onChange}
                data-cy="zip"
                variant="outlined"
                margin="normal"
                required
                name="zip"
                label="Zip"
                placeholder="zip"
                type="text"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </div>

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
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              sx={{ marginTop: 1 }}
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
              label="email"
              placeholder="email@domain.com"
              type="email"
            />
          )}
        />
        <div>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'phone number required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                size="small"
                sx={{ flexGrow: 1 }}
                onChange={onChange}
                data-cy="phone"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Phone"
                placeholder=""
                type="text"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </div>
      </Form>
    </>
  )
}

export default CustomerInformationStep
