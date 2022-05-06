import {
  Slide,
  AlertColor,
  Button,
  Alert,
  AlertTitle,
  Snackbar as MuiSnackbar,
} from '@mui/material'
import { styled } from '@mui/system'
import { MAIN_NAV_WIDTH, MAIN_NAV_WIDTH_SM } from 'constants/'

const StyledSnackbar = styled(MuiSnackbar)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    left: 0,
    marginBottom: 0,
  },

  [theme.breakpoints.up('sm')]: {
    paddingLeft: `${MAIN_NAV_WIDTH_SM}px`,
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: `${MAIN_NAV_WIDTH}px`,
  },
  '& .MuiAlert-root': {
    padding: `${theme.spacing(1)} ${theme.spacing(3)} ${theme.spacing(
      1
    )} ${theme.spacing(2)}`,
  },

  '& .MuiAlertTitle-root': {
    marginBottom: 0,
  },

  '& .MuiAlert-message': {
    paddingRight: theme.spacing(4),
  },

  '& .MuiAlert-action, .MuiAlert-icon': {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}))

type ButtonAction = {
  url: string
  method: () => void
}

interface ISnackbar {
  severity?: AlertColor
  title?: string
  description?: string
  open?: boolean
  action?: ButtonAction
}

const Snackbar = ({
  severity = 'info',
  title = 'Hello',
  description = 'World',
  open = true,
  action = {
    url: 'Action',
    method: () => {
      alert('Action!')
    },
  },
}: ISnackbar) => {
  return (
    <StyledSnackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={() => {}}
      sx={{ width: '100%' }}
      TransitionComponent={Slide}
    >
      <Alert
        severity={severity}
        // color="error"
        action={
          <Button color={severity} onClick={action.method} variant="outlined">
            {action.url}
          </Button>
        }
      >
        <AlertTitle>
          <strong>{title}</strong>
        </AlertTitle>
        {description}
      </Alert>
    </StyledSnackbar>
  )
}

export default Snackbar
