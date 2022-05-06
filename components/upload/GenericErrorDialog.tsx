import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const GenericErrorDialog = (props: {
  errorMessage: string
  visible: boolean
  onDismiss: () => void
}) => {
  const theme = useTheme()
  const { errorMessage, visible, onDismiss } = props
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
          Unexpected error
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pr: 4, pb: 3, pl: 5 }}>
        <Typography sx={textSx}>{errorMessage}</Typography>
        <Typography sx={textSx}>Please try again</Typography>
      </DialogContent>
      <DialogActions sx={{ pt: 0, pr: 4, pb: 4, pl: 4 }}>
        <Button fullWidth size="large" onClick={onDismiss} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GenericErrorDialog
