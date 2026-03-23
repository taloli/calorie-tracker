import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { DailyTotal } from '@/types'
import { hebrewDayLabel, getLast7Days, todayString } from '@/lib/utils'

interface WeeklyBarChartProps {
  data: DailyTotal[]
  calorieGoal: number
}

export default function WeeklyBarChart({ data, calorieGoal }: WeeklyBarChartProps) {
  const today = todayString()
  const last7 = getLast7Days()

  // Fill in missing days with 0
  const chartData = last7.map((date) => {
    const found = data.find((d) => d.logged_date === date)
    return {
      date,
      day: hebrewDayLabel(date),
      calories: found ? Math.round(found.total_calories) : 0,
      isToday: date === today,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          tickCount={4}
        />
        <Tooltip
          formatter={(value) => [`${value} קק"ל`, 'קלוריות']}
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
        <ReferenceLine
          y={calorieGoal}
          stroke="#22c55e"
          strokeDasharray="4 4"
          label={{ value: 'יעד', position: 'insideTopRight', fontSize: 11, fill: '#22c55e' }}
        />
        <Bar dataKey="calories" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.isToday
                  ? '#22c55e'
                  : entry.calories > calorieGoal
                  ? '#fca5a5'
                  : '#d1fae5'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
