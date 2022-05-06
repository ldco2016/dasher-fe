import { styled } from '@mui/system'
import { IVariabilityText } from 'types'

const Low = styled('span')(({ theme }) => ({
  color: theme.typography.body1.color,
}))

const High = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}))

const Moderate = styled('span')(({ theme }) => ({
  color: theme.palette.warnText.main,
}))

const VariabilityText = ({ variability }: IVariabilityText) => {
  let Component

  switch (variability) {
    case 'Low':
      Component = Low
      break
    case 'High':
      Component = High
      break
    case 'Moderate':
      Component = Moderate
      break
    default:
      break
  }

  return <Component>{variability}</Component>
}

export default VariabilityText
