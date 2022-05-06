import { styled } from '@mui/system'

const StatusIconStyle = styled('div')(({ theme }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  left: '33px',
  top: '8px',
}))

interface IStatusIcon {
  active: boolean
}

const StatusIcon = ({ active }: IStatusIcon) =>
  active ? <StatusIconStyle /> : null

export default StatusIcon
