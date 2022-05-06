import React, { PureComponent } from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 100 },
  { name: 'Group C', value: 300 },
]
const COLORS = ['#00C49F', '#FFC765', '#FF8042']
// red #f74d58
// dark blue #184866
// light blue #037BD6
// grey #F1FSF6
// yellow #FFC765
export default class Example extends PureComponent {
  render() {
    return (
      <PieChart
        width={120}
        height={120}
        onMouseEnter={this.onPieEnter}
        style={{ margin: '0 auto' }}
      >
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={38}
          outerRadius={55}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }
}
