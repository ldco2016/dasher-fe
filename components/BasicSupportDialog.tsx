import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Button,
} from '@mui/material'
import env from '@beam-australia/react-env'

export type IBasicSupportDialogProps = {
  displayed: boolean
  closeDialog: () => void
}

function BasicSupportDialog(props: IBasicSupportDialogProps) {
  const { closeDialog, displayed } = props
  const address = env('SUPPORT_EMAIL_PROVIDERS')
  const address2 = address.replace('mailto:', '')

  return (
    <Dialog onClose={closeDialog} open={displayed}>
      <DialogTitle>Support</DialogTitle>
      <DialogContent>
        Please E-Mail{' '}
        <Link href={address} target={'_blank'}>
          {address2}
        </Link>
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={closeDialog} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BasicSupportDialog
