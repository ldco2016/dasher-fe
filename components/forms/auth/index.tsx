import { Link, Typography } from '@mui/material'
import { styled } from '@mui/system'
import env from '@beam-australia/react-env'

const Legal = styled(Typography)(({ theme }) => ({
  fontSize: '.7rem',
  color: theme.palette.grey[600],
  textAlign: 'center',
}))

function AuthHelperText() {
  return (
    <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
      Trouble Logging in? <br />
      <Link href={`${env('SUPPORT_EMAIL_PROVIDERS')}`} variant="body2">
        {'Contact Support'}
      </Link>
    </Typography>
  )
}

function LegalBlurb() {
  return (
    <Legal>
      Aluna and the Aluna logo are trademarks of KNOX Medical Diagnostics, Inc.
    </Legal>
  )
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 3,
  height: '100vh',
  padding: theme.spacing(2),
}))

const FormStyle = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  flexGrow: 1,
}))

export { Container, FormStyle, LegalBlurb, AuthHelperText }
