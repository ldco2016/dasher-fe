import React from 'react'
import { Box, CircularProgress, LinearProgress } from '@mui/material'

export const CircleLoader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '128px',
    }}
  >
    <CircularProgress />
  </Box>
)

export const LinearLoader = () => (
  <LinearProgress sx={{ zIndex: 99999 }} color="secondary" />
)
