import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { IProviderSelect } from 'types'

const ProviderSelect = ({
  providers,
  providerFilter,
  handleChange,
}: IProviderSelect) => {
  const handleSelectProvider = (event) => handleChange(event.target.value)

  return (
    <FormControl sx={{ mr: 1, minWidth: '140px', width: '100%' }}>
      <InputLabel id="providers-select-label">Providers</InputLabel>
      <Select
        labelId="providers-select-label"
        id="providers-select"
        value={providerFilter}
        label="Provideres"
        autoWidth
        size="small"
        onChange={handleSelectProvider}
      >
        <MenuItem value="All Providers">All Providers</MenuItem>
        {providers.map((provider) => (
          <MenuItem value={provider} key={provider}>
            {provider}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ProviderSelect
