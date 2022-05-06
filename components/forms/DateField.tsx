import React from 'react'
import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { IDateField } from 'types'
import NumberFormat from 'react-number-format'

const BirthDateField = ({
  name,
  label = name,
  required = true,
  rules = {
    required: required ? 'date required' : false,
    pattern: {
      value:
        /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/g,
      message: 'not a valid date',
    },
  },
  disabled = false,
  sx = { mt: 1 },
  size = 'small',
  fullWidth = true,
  color,
  focused,
  hightlightIfEmpty = false,
}: IDateField) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        console.log('value: ', value)
        return (
          <NumberFormat
            sx={{
              mb: 0.5,
              ...sx,
            }}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            label={label}
            required={required}
            error={!!error}
            value={value || ''}
            helperText={error ? error.message : null}
            customInput={TextField}
            format="##/##/####"
            placeholder="MM/DD/YYYY"
            mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
            allowEmptyFormatting
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
            onValueChange={(birthDate) => {
              return onChange(birthDate.formattedValue)
            }}
          />
        )
      }}
    />
  )
}

export default BirthDateField
