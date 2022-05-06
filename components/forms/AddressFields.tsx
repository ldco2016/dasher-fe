import React, { useState, useEffect } from 'react'
import {
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
  InputLabel,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { styled } from '@mui/system'
import ControlledTextField from '../forms/ControlledTextField'
import UsStates from './data/UsStates.json'
import { IAddressFields } from 'types'

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

const AddressFields = ({
  type = 'mailing+billing',
  billingCheck = false,
  showNotes = false,
  hightlightIfEmpty = false,
}: IAddressFields) => {
  const { control } = useFormContext()
  const [showBillingAddress, setShowBillingAddress] = useState(false)
  const [mailingState, setMailingState] = useState('')
  const [billingState, setBillingState] = useState('')

  useEffect(() => {
    // @ts-ignore
    setMailingState(control.defaultValuesRef.current.state)
  }, [control])

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h3" sx={{ textTransform: 'capitalize', mb: 1 }}>
        {type === 'mailing+billing' ? 'mailing' : type} Address
      </Typography>{' '}
      <FormLabel component="legend">
        {billingCheck && (
          <Controller
            control={control}
            name="showBillingAddress"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControlLabel
                sx={{ ml: 0 }}
                control={
                  <Checkbox
                    name="showBillingAddress"
                    checked={showBillingAddress}
                    value={showBillingAddress}
                    onChange={onChange}
                    onClick={() => {
                      setShowBillingAddress(!showBillingAddress)
                    }}
                  />
                }
                label="billing is same as mailing"
              />
            )}
          />
        )}
      </FormLabel>
      <FormGroup id="mailingAddress">
        <Box style={{ display: 'flex' }}>
          <ControlledTextField
            name="street"
            sx={{ mr: 1, flexGrow: 1 }}
            fullWidth={false}
            rules={{
              required: 'street required',
            }}
            hightlightIfEmpty={hightlightIfEmpty}
          />
          <ControlledTextField
            name="unitNumber"
            label="Apt., suite, etc."
            fullWidth={false}
            required={false}
            sx={{ mr: 1, flexGrow: 1 }}
          />
        </Box>

        <Box style={{ display: 'flex' }}>
          <ControlledTextField
            name="city"
            fullWidth={false}
            sx={{ mr: 1 }}
            rules={{
              required: 'city required',
            }}
            hightlightIfEmpty={hightlightIfEmpty}
          />
          <Controller
            control={control}
            name="state"
            rules={{
              required: 'state required',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <FormControl
                  required
                  sx={{ mt: 1, mr: 1, minWidth: 183, flexGrow: 1 }}
                  error={error ? true : false}
                >
                  <CustomInputLabel htmlFor="state-select-label">
                    State
                  </CustomInputLabel>
                  <Select
                    labelId="state-select-label"
                    label="State&nbsp;&nbsp;"
                    autoWidth
                    size="small"
                    required
                    value={mailingState}
                    error={!!error}
                    onChange={(event) => {
                      onChange(event)
                      setMailingState(event.target.value)
                    }}
                  >
                    {Object.entries(UsStates).map(([key, value]) => {
                      return <MenuItem value={key}>{value}</MenuItem>
                    })}
                  </Select>
                  {error ? (
                    <FormHelperText>{error.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )
            }}
          />

          <ControlledTextField
            name="zip"
            fullWidth={false}
            rules={{
              required: 'zip required',
            }}
            sx={{ marginTop: 1, minWidth: 80 }}
            hightlightIfEmpty={hightlightIfEmpty}
          />
        </Box>

        {showNotes && (
          <ControlledTextField
            name="notes"
            multiline={true}
            rows={3}
            sx={{ mt: 1 }}
            placeholder="delivery instructions"
          />
        )}
      </FormGroup>
      {showBillingAddress && (
        <>
          <FormLabel component="legend" sx={{ mt: 2 }}>
            Billing Address
          </FormLabel>

          <FormGroup id="billingAddress">
            <ControlledTextField name="billingStreet" />
            <div style={{ display: 'flex' }}>
              <ControlledTextField
                name="billingCity"
                fullWidth={false}
                sx={{
                  marginTop: 1,
                  marginRight: 1,
                  flexGrow: 1,
                }}
              />
              <Controller
                control={control}
                name="billingState"
                rules={{
                  required: 'state required',
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl
                    sx={{ mt: 1, mr: 1, width: 90 }}
                    error={error ? true : false}
                  >
                    <CustomInputLabel htmlFor="state-select-label2">
                      State
                    </CustomInputLabel>
                    <Select
                      labelId="state-select-label2"
                      id="bililngState"
                      label="Billing State"
                      autoWidth
                      size="small"
                      value={billingState}
                      renderValue={(option) => option}
                      error={!!error}
                      onChange={(event) => {
                        onChange
                        setMailingState(event.target.value)
                      }}
                    >
                      {Object.entries(UsStates).map(([key, value]) => {
                        return <MenuItem value={key}>{value}</MenuItem>
                      })}
                    </Select>
                    {error ? (
                      <FormHelperText>{error.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              <ControlledTextField
                name="billingZip"
                fullWidth={false}
                sx={{ marginTop: 1, width: 80 }}
              />
            </div>

            <ControlledTextField
              name="billingNotes"
              multiline={true}
              rows={3}
              sx={{ mt: 1 }}
              placeholder="delivery instructions"
            />
          </FormGroup>
        </>
      )}
    </Box>
  )
}

export default AddressFields
