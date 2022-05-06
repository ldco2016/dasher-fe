import { Typography } from '@mui/material'
import { ReactChild } from 'react'

interface ILegalCopy {
  children: ReactChild
}

const LegalCopy = ({ children }: ILegalCopy) => {
  return (
    <Typography variant="body2" sx={{ padding: 2, border: '1px solid black' }}>
      {children}
    </Typography>
  )
}

export default LegalCopy
