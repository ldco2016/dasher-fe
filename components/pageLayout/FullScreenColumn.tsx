import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import { ReactChild } from 'react'

interface IFullScreenColumn {
  children: ReactChild
  type: 'marketing1' | 'marketing2' | 'brandDark'
}

const DefaultStyle = styled(Grid)(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
}))

const BrandDarkStyle = styled(Grid)(({ theme }) => ({
  position: 'relative',
  background: '#507992',
  padding: theme.spacing(4),
  color: 'white',
}))

const Marketing1Style = styled(Grid)(() => ({
  justifyContent: 'center',
  background: '#507992',
  position: 'relative',
  overflow: 'hidden',
  '&:before, &:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    backgroundColor: '#456d86',
    width: 400,
    height: 400,
    borderRadius: '50%',
    top: '120px',
    left: '-34%',
    zIndex: 0,
  },
  '&:after': {
    left: '42%',
  },
}))

const FullScreenColumn = ({ ...props }) => {
  if (props.type === 'marketing1') return <Marketing1Style {...props} />
  if (props.type === 'brandDark') return <BrandDarkStyle {...props} />
  return <DefaultStyle {...props} />
}

export default FullScreenColumn
