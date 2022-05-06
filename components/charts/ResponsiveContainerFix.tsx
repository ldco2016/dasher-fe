import React, { ReactElement } from 'react'
import { Box } from '@mui/material'

interface IResponsiveContainerFix {
  children: ReactElement
  height: number
  left?: number
}

// This utility component fixes scale and resizing issues with ResponsiveContainer for
// charts which have a variable width and fixed height (PatientStats and SpirometryGraphs)
const ResponsiveContainerFix = ({
  children,
  height = 400,
  left = 0,
}: IResponsiveContainerFix) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pb: `${height}px`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: `${left}px`,
          right: 0,
          bottom: 0,
          top: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default ResponsiveContainerFix
