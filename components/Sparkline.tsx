import { LineChart, Line } from 'recharts'
import Theme from '../constants/theme'
import { ISparkline } from 'types'

const Sparkline = ({ data }: ISparkline) => {
  return (
    <LineChart width={50} height={20} style={{ display: 'inline' }} data={data}>
      <Line
        type="monotone"
        dataKey={(v) => v}
        dot={false}
        stroke={Theme.palette.primary.main}
      />
    </LineChart>
  )
}

export default Sparkline
