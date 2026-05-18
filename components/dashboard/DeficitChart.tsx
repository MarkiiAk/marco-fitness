'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, ResponsiveContainer } from 'recharts'
import { formatDateShort } from '@/lib/utils'

interface DeficitChartProps {
  data: { fecha: string; deficit_real_kcal: number | null }[]
}

export default function DeficitChart({ data }: DeficitChartProps) {
  const chartData = data.map(d => ({
    fecha: formatDateShort(d.fecha),
    deficit: d.deficit_real_kcal ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
        <XAxis dataKey="fecha" tick={{ fill: '#a1a1aa', fontSize: 10 }} stroke="#3f3f46" />
        <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} stroke="#3f3f46" />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
          labelStyle={{ color: '#fafafa', fontSize: 12 }}
          itemStyle={{ fontSize: 12 }}
          formatter={(v) => [`${Number(v).toLocaleString()} kcal`, 'Déficit']}
        />
        <ReferenceLine y={700} stroke="#34d399" strokeDasharray="4 4" />
        <Bar dataKey="deficit" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.deficit >= 500 ? '#34d399' : entry.deficit >= 100 ? '#fbbf24' : '#fb7185'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
