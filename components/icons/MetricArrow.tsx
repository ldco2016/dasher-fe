import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

interface IMetricArrow {
  direction?: 'up' | 'down'
}

const MetricArrow = ({ direction = 'up' }: IMetricArrow) => {
  const isUp = direction === 'up'

  return (
    <span
      style={{
        fontSize: '1rem',
        color: `${isUp ? 'green' : 'red'}`,
        verticalAlign: 'middle',
      }}
    >
      {isUp ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
    </span>
  )
}

export default MetricArrow
