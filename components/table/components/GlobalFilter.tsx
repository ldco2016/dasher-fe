import React from 'react'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/system'
import { IGlobalFilter } from 'types'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.grey[300]}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  marginRight: theme.spacing(0),
  marginLeft: 0,
  width: '100%',
  maxWidth: '600px',
  minWidth: '170px',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}))

const SearchIconStyle = styled('div')(({ theme }) => ({
  width: theme.spacing(7),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const InputBaseStyle = styled(InputBase)(({ theme }) => ({
  root: {
    color: 'inherit',
  },
  input: {
    padding: theme.spacing(0.9, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  placeholder = 'search',
}: IGlobalFilter) => {
  const count = preGlobalFilteredRows.length

  // Global filter only works with pagination from the first page.
  // This may not be a problem for server side pagination when
  // only the current page is downloaded.
  return (
    <Search>
      <SearchIconStyle>
        <SearchIcon />
      </SearchIconStyle>
      <InputBaseStyle
        fullWidth
        value={globalFilter || ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  )
}

export default GlobalFilter
