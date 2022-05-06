import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, Typography } from '@mui/material'
import React from 'react'

const UploadPendingSection = ({ Theme: theme }) => {
  return (
    <>
      <CloudUploadIcon
        sx={{
          color: theme.palette.primary.main,
          width: '3em',
          height: '3em',
        }}
      />
      <Typography variant="h1" sx={{ mb: 2, fontWeight: 'normal' }}>
        Upload a Document
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {' '}
        File Type: Excel XLS or CSV
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Drag and drop here or
      </Typography>
      <Button
        variant="secondary"
        sx={{
          minWidth: '150px',
          mt: theme.spacing(1),
        }}
      >
        Browse Files
      </Button>
    </>
  )
}

export default UploadPendingSection
