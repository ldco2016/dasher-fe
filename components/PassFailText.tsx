import { styled, darken } from '@mui/system'
import { IPassFailText } from 'types'

const Fail = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}))

const Pass = styled('span')(({ theme }) => ({
  color: darken(theme.palette.success.main, 0.2),
}))

const Neutral = styled('span')(({ theme }) => ({
  color: theme.typography.body1.color,
}))

const PassFailText = ({ condition, children }: IPassFailText) => {
  if (children === 'N/A') return <Neutral>{children}</Neutral>
  return condition ? <Pass>{children}</Pass> : <Fail>{children}</Fail>
}

export default PassFailText
