import Link from 'next/link'
import MuiLink from '@mui/material/Link'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import Fade from '@mui/material/Fade'
import { Tooltip } from '@mui/material'

export const NextLink = ({ children, href, ...other }) => {
  return (
    <Link href={href}>
      <MuiLink {...other}>{children}</MuiLink>
    </Link>
  )
}

export const InfoTooltip = ({ content }) => {
  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 0 }}
      title={content}
      followCursor={true}
      arrow
    >
      <HelpOutlineOutlinedIcon
        color="info"
        sx={{
          width: '16px',
          ml: '3px',
          mt: '-3px',
          position: 'absolute',
          verticalAlign: 'middle',
        }}
      />
    </Tooltip>
  )
}
