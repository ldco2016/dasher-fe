import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import CheckIcon from '@mui/icons-material/Check'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import { IMultiSelectChip } from 'types'
import ChipCommonFilter from './util/ChipCommonFilter'
import { MenuProps, getStyles } from './util'
import { ReactElement } from 'react'

type VarientType =
  | 'default'
  | 'filled'
  | 'outlined'
  | 'success'
  | 'warning'
  | 'error'
  | 'defaultErrorText'
  | 'pill'
  | 'pillSuccess'
  | 'pillWarning'
  | 'all'

function MultiSelectChip({
  options,
  selectedValues,
  labelText,
  handleChange,
}: IMultiSelectChip) {
  const theme = useTheme()

  const ChipBoxes = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {selected.map((value: string) => {
        let variant: VarientType
        let icon: JSX.Element

        switch (value.toLowerCase()) {
          case 'all':
            variant = 'all'
            break
          case 'verypoor':
            variant = 'error'
            icon = <WarningAmberOutlinedIcon />
            break
          case 'poor':
            variant = 'warning'
            break
          case 'incomplete':
            variant = 'pillWarning'
            icon = <ErrorOutlineOutlinedIcon />
            break
          case 'verified':
            variant = 'pillSuccess'
            icon = <CheckIcon />
            break

          default:
            variant = 'default'
            break
        }

        return (
          <Chip
            data-cy={`chip-${variant}-${value}`}
            key={value}
            icon={icon}
            variant={variant}
            label={value.replace(/([A-Z])/g, ' $1')}
            sx={{ m: '2px' }}
            onMouseDown={(event) => {
              event.stopPropagation()
            }}
            onDelete={
              value !== 'all'
                ? (evt) => handleChange(evt, null, value)
                : undefined
            }
          />
        )
      })}
    </Box>
  )

  return (
    <FormControl
      data-cy="multiselect-chip-form-control"
      sx={{
        mr: 1,
        minWidth: '140px',
        width: '100%',
      }}
    >
      <InputLabel data-cy="multi-select-chip-label">{labelText}</InputLabel>
      <Select
        data-cy="multi-select-chip-select"
        multiple
        value={selectedValues}
        onChange={(event, child: ReactElement) => {
          return handleChange(event, child)
        }}
        size="small"
        input={
          <OutlinedInput
            data-cy="multi-select-chip-input-outlined-input"
            name="select-multiple-chip"
            label={labelText}
            sx={{
              '& .MuiOutlinedInput-input': {
                pt: '6px',
                pb: '5px',
              },
            }}
          />
        }
        // TODO: add enumerated prop for these variants
        renderValue={ChipBoxes}
        // @ts-ignore
        MenuProps={MenuProps}
      >
        {options.map((option, index) => (
          <MenuItem
            data-cy={`menu-item-${option}-${index}`}
            key={index}
            value={option}
            style={getStyles(option, selectedValues, theme)}
          >
            {option.replace(/([A-Z])/g, ' $1')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export { ChipCommonFilter }
export default MultiSelectChip
