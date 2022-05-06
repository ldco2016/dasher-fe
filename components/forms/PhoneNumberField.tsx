import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { IPhoneNumberField } from 'types'
import NumberFormat from 'react-number-format'

const PhoneNumberField = ({
  name,
  label = name,
  required = true,
  rules = {
    required: required ? '# required' : false,
    pattern: {
      value: /(\(?[0-9]{3}\)?)((\s|\-){1})?[0-9]{3}((\s|\-){1})?[x0-9]{4}/g,
      message: 'not a valid phone number',
    },
  },
  disabled = false,
  sx = { mt: 1 },
  size = 'small',
  fullWidth = true,
  color,
  focused,
  hightlightIfEmpty = false,
}: IPhoneNumberField) => {
  const { control, setValue } = useFormContext()
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      data-cy="phone-number-field-controller"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <NumberFormat
            sx={{
              mb: 0.5,
              ...sx,
            }}
            size={size}
            fullWidth={fullWidth}
            data-cy="phone-number-field-number-format"
            disabled={disabled}
            label={label}
            required={required}
            error={!!error}
            value={value || ''}
            helperText={error ? error.message : null}
            customInput={TextField}
            format="+1 (###) ###-#### x####"
            allowEmptyFormatting
            mask="_"
            // @ts-ignore
            color={
              color ||
              (hightlightIfEmpty &&
                (!value || value === 'Invalid date') &&
                'warning')
            }
            focused={
              focused ||
              (hightlightIfEmpty && !value) ||
              value === 'Invalid date'
            }
            onKeyUp={() => {
              setValue(`${name}Stripped`, phoneNumber)
            }}
            onValueChange={(phoneNumber) => {
              let formattedPhoneNumber = phoneNumber.formattedValue

              // setValue is used onKeyUp so that x and_ can be stripped
              // in the cases below. If they are stripped and then passed
              // to the onChange handler, the missing formating will cause
              // this component to become out of sync with format="+1 (###) ###-#### x####"
              if (phoneNumber.value.length <= 10)
                setPhoneNumber(formattedPhoneNumber.replace(/[_x]/g, ''))

              if (phoneNumber.value.length > 10)
                setPhoneNumber(formattedPhoneNumber.replace(/_/g, ''))

              return onChange(formattedPhoneNumber)
            }}
          />
        )
      }}
    />
  )
}

export default PhoneNumberField
