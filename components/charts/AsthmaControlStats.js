import { Typography, Paper } from '@mui/material'
import ContentBlock from '../ContentBlock'
import { styled, useTheme } from '@mui/system'

const CustomTooltipStyle = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: '1px 10px',
}))

const CircleStyle = styled(Paper)(({ theme }) => ({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  marginRight: 5,
}))

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  {
    month: 'Jan',
    poorly: 10,
    notWell: 30,
    well: 60,
  },
  {
    month: 'Feb',
    poorly: 15,
    notWell: 35,
    well: 50,
  },
  {
    month: 'Mar',
    poorly: 8,
    notWell: 22,
    well: 70,
  },
  {
    month: 'Apr',
    poorly: 13,
    notWell: 22,
    well: 65,
  },
  {
    month: 'May',
    poorly: 20,
    notWell: 10,
    well: 70,
  },
  {
    month: 'Jun',
    poorly: 12,
    notWell: 28,
    well: 60,
  },
  {
    month: 'Jul',
    poorly: 10,
    notWell: 40,
    well: 50,
  },
  {
    month: 'Aug',
    poorly: 40,
    notWell: 35,
    well: 25,
  },
  {
    month: 'Sep',
    poorly: 35,
    notWell: 20,
    well: 45,
  },
  {
    month: 'Oct',
    poorly: 20,
    notWell: 15,
    well: 65,
  },
  {
    month: 'Nov',
    poorly: 15,
    notWell: 25,
    well: 60,
  },
  {
    month: 'Dec',
    poorly: 5,
    notWell: 20,
    well: 75,
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper>
        <p>{label}</p>
        <p>
          {' '}
          <CircleStyle style={{ background: payload[0].stroke }} />
          {payload[0].value} patients <strong>{payload[0].value}%</strong>
        </p>
        <p>
          {' '}
          <CircleStyle style={{ background: payload[1].stroke }} />
          {payload[0].value} patients <strong>{payload[1].value}%</strong>
        </p>
        <p>
          {' '}
          <CircleStyle style={{ background: payload[2].stroke }} />
          {payload[0].value} patients <strong>{payload[2].value}%</strong>
        </p>
      </Paper>
    )
  }

  return null
}

const AsthmaControlStats = () => {
  const theme = useTheme()
  return (
    <>
      <ContentBlock>
        <Typography variant="h2" align="left" sx={{ ml: 2, mt: 1 }}>
          Asthma Control Stats
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 25,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            {/* <Tooltip /> */}
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="center" />
            <Line
              type="monotone"
              dataKey="poorly"
              stroke="red"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="notWell" stroke="orange" />
            <Line type="monotone" dataKey="well" stroke="green" />
          </LineChart>
        </ResponsiveContainer>
      </ContentBlock>
    </>
  )
}

export default AsthmaControlStats
