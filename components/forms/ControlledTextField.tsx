import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { IControlledTextField } from 'types'

const ControlledTextField = ({
  name,
  label = name,
  placeholder = '',
  rules,
  type = 'text', //What are the options.
  disabled = false,
  sx,
  fullWidth = true,
  required = true,
  rows = 1,
  multiline = false,
  size = 'small',
  variant = 'outlined',
  color,
  focused,
  hightlightIfEmpty = false,
}: IControlledTextField) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          value={value || ''}
          size={size}
          sx={sx}
          onChange={onChange}
          data-cy={name}
          variant={variant}
          margin="dense"
          fullWidth={fullWidth}
          required={required}
          name={name}
          label={label}
          placeholder={placeholder}
          type={type}
          rows={rows}
          multiline={multiline}
          error={!!error}
          helperText={error ? error.message : null}
          disabled={disabled}
          color={color || (hightlightIfEmpty && !value ? 'warning' : undefined)}
          focused={focused || (hightlightIfEmpty && !value)}
        />
      )}
    />
  )
}

export default ControlledTextField
