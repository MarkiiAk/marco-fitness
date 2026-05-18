'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { formatDateShort } from '@/lib/utils'

interface WeightChartProps {
  data: { fecha: string; peso_kg: number; cintura_cm: number | null }[]
  pesoInicial: number
  pesoMeta: number
}

export default function WeightChart({ data, pesoInicial, pesoMeta }: WeightChartProps) {
  const chartData = data.map(d => ({
    fecha: formatDateShort(d.fecha),
    peso: d.peso_kg,
  }))

  const minY = Math.floor(Math.min(...data.map(d => d.peso_kg), pesoMeta) - 1)
  const maxY = Math.ceil(Math.max(...data.map(d => d.peso_kg), pesoInicial) + 1)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
        <XAxis dataKey="fecha" tick={{ fill: '#a1a1aa', fontSize: 10 }} stroke="#3f3f46" />
        <YAxis domain={[minY, maxY]} tick={{ fill: '#a1a1aa', fontSize: 10 }} stroke="#3f3f46" />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
          labelStyle={{ color: '#fafafa', fontSize: 12 }}
          itemStyle={{ color: '#34d399', fontSize: 12 }}
          formatter={(v) => [`${v} kg`, 'Peso']}
        />
        <ReferenceLine y={pesoMeta} stroke="#52525b" strokeDasharray="4 4" label={{ value: `Meta ${pesoMeta}kg`, fill: '#52525b', fontSize: 10 }} />
        <ReferenceLine y={89.5} stroke="#78716c" strokeDasharray="3 3" label={{ value: 'Pre-vac', fill: '#78716c', fontSize: 10 }} />
        <Line type="monotone" dataKey="peso" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
