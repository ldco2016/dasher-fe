import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const SubmissionConfirmationDialog = (props: {
  SubmissionConfirmationModalOpen: boolean
  onDismiss: () => void
}) => {
  const theme = useTheme()
  const {
    SubmissionConfirmationModalOpen: submissionConfirmationModalOpen,
    onDismiss,
  } = props

  return (
    <Dialog
      open={submissionConfirmationModalOpen}
      onClose={onDismiss}
      sx={{ textAlign: 'center' }}
      maxWidth="xs"
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
          Submission Confirmation
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pr: 4, pb: 3, pl: 5 }}>
        <Typography sx={{ mb: 3 }}>
          We will begin verifying your patients’ insurance eligibility over the
          next 2-3 business days.
        </Typography>

        <Typography variant="h3" sx={{ mb: 1 }}>
          What Next?
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Once a patient has been verified, you will be notified. You may then
          choose to accept that patient and activate them after their consent is
          given or received.{' '}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ pt: 0, pr: 4, pb: 4, pl: 4 }}>
        <Button fullWidth size="large" onClick={onDismiss} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubmissionConfirmationDialog
