import React, { ReactNode } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export interface DialogTitleProps {
  onClose?: () => void
  children: ReactNode
}

const AlunaDialogTitle = ({
  onClose = () => {},
  children,
  ...other
}: DialogTitleProps) => {
  return (
    <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

interface IAlunaDialog {
  title?: string
  children: ReactNode
  handleClose: () => void
  isOpen: boolean
}
const AlunaDialog = ({
  title = 'Dialog Header',
  children,
  handleClose,
  isOpen,
}: IAlunaDialog) => {
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      hideBackdrop
      open={isOpen}
      onClose={handleClose}
    >
      <AlunaDialogTitle onClose={handleClose}>{title}</AlunaDialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default AlunaDialog
