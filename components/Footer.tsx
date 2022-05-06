import { styled } from '@mui/system'
import Moment from 'react-moment'
import { Link } from '@mui/material'
import { MAIN_NAV_WIDTH } from '../constants'

const FooterStyle = styled('footer')(({ theme }) => ({
  ...theme.typography.body2,
  position: 'fixed',
  bottom: 0,
  marginLeft: MAIN_NAV_WIDTH,
  right: 0,
  left: 0,
  background: theme.palette.background.default,
  padding: `${theme.spacing(0.5)} ${theme.spacing(4)}`,
}))

const Footer = () => (
  <FooterStyle>
    © Aluna <Moment format="YYYY" date={new Date()} />. All Rights Reserved.{' '}
    <Link href="/legal/privacy" variant="body2">
      Privacy Policy
    </Link>{' '}
    |{' '}
    <Link href="/legal/terms" variant="body2">
      Terms of use
    </Link>
  </FooterStyle>
)

export default Footer
