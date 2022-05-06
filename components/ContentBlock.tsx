import { Paper } from '@mui/material'
import { styled } from '@mui/system'

interface IContentBlock {
  theme: any
  sx?: object
}

const ContentBlock = styled(Paper)(({ theme, sx }: IContentBlock) => ({
  ...theme.typography.body2,
  padding: theme.spacing(4),
  boxShadow: 'none',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(2),
  },
  ...sx,
}))

export default ContentBlock
