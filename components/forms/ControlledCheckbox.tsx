import { TextField, FormControlLabel, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface IControlledCheckbox {
  name: string
  label?: string
}

const ControlledCheckbox = ({ name, label = name }: IControlledCheckbox) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControlLabel
          sx={{ ml: 0 }}
          onChange={onChange}
          control={<Checkbox name="bug" checked={value} value={value} />}
          label={label}
        />
      )}
    />
  )
}

export default ControlledCheckbox
