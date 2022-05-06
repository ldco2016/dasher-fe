import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import FileLoadFailedDetailsBox from './FileLoadFailedDetailsBox'
import { IUploadError } from 'types/upload'
import { useTheme } from '@mui/material/styles'

const FileLoadFailedDialog = (props: {
  errors: IUploadError[]
  visible: boolean
  onDismiss: () => void
}) => {
  const theme = useTheme()
  const { errors, visible, onDismiss } = props
  const textSx = { mb: 1 }
  return (
    <Dialog
      open={visible}
      onClose={onDismiss}
      sx={{ textAlign: 'center' }}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle
        sx={{
          pt: 6,
          pr: theme.spacing(5),
          pl: theme.spacing(5),
          pb: theme.spacing(5),
        }}
      >
        <Typography variant="h1" component="div">
          Invalid or missing patient data
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pr: 4, pb: 3, pl: 5 }}>
        <Typography sx={textSx}>
          Sorry, we can't process a file for Insurance eligibility verification.
        </Typography>
        <Typography sx={textSx}>
          Please verify and correct patients information and try again
        </Typography>
      </DialogContent>
      <FileLoadFailedDetailsBox errors={errors} />
      <DialogActions sx={{ pt: 0, pr: 4, pb: 4, pl: 4 }}>
        <Button fullWidth size="large" onClick={onDismiss} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FileLoadFailedDialog
