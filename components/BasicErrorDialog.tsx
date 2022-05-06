import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'

export type IErrorDialogProps = {
  errorTitle: string
  errorMessage: string
  displayed: boolean
  closeDialog: () => void
}

function BasicErrorDialog(props: IErrorDialogProps) {
  const { errorTitle, errorMessage, closeDialog, displayed } = props

  return (
    <Dialog onClose={closeDialog} open={displayed}>
      <DialogTitle>{errorTitle}</DialogTitle>
      <DialogContent>{errorMessage}</DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={closeDialog} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BasicErrorDialog
