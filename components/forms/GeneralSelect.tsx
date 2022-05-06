import { styled } from '@mui/system'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { IGeneralSelect } from 'types'

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

const GeneralSelect = ({
  label,
  value = 'default 1',
  options = ['default 1', 'default 2', 'default 3'],
  minWidth = 150,
  handleChange,
}: IGeneralSelect) => {
  return (
    <FormControl sx={{ mr: 1, mb: 1, minWidth, flexGrow: 1 }}>
      <CustomInputLabel htmlFor={`${label}-select-label`}>
        {label}
      </CustomInputLabel>
      <Select
        labelId={`${label}-select-label`}
        id={label}
        value={value}
        label={label}
        autoWidth
        size="small"
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <MenuItem value={option} key={index}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default GeneralSelect
