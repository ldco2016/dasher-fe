import { styled } from '@mui/system'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { IClinicSelect } from 'types'

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

const ClinicSelect = ({ clinic, handleChange }: IClinicSelect) => {
  return (
    <FormControl sx={{ mr: 1, mb: 1, minWidth: 138, flexGrow: 1 }}>
      <CustomInputLabel htmlFor="control-level-select-label">
        All Clinics
      </CustomInputLabel>
      <Select
        labelId="clinic-select-label"
        id="clinic"
        value={clinic}
        label="Clinic"
        autoWidth
        size="small"
        onChange={handleChange}
      >
        <MenuItem value="Clinic 1">Clinic 1</MenuItem>
        <MenuItem value="Clinic 2">Clinic 2</MenuItem>
        <MenuItem value="Clinic 3">Clinic 3</MenuItem>
        <MenuItem value="Clinic 4">Clinic 4</MenuItem>
      </Select>
    </FormControl>
  )
}

export default ClinicSelect
