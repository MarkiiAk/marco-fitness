import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  unit?: string
  delta?: string
  deltaPositiveIsGood?: boolean
  sub?: string
  className?: string
}

export default function StatCard({
  label, value, unit, delta, deltaPositiveIsGood = true, sub, className
}: StatCardProps) {
  const isPositive = delta?.startsWith('+')
  const isNegative = delta?.startsWith('-')
  const deltaGood = deltaPositiveIsGood ? isPositive : isNegative

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-5',
      'bg-zinc-900/80 border border-white/[0.06]',
      className
    )}>
      {/* Gradiente sutil */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Label */}
      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-3">
        {label}
      </p>

      {/* Número principal */}
      <div className="flex items-baseline gap-1.5">
        <p className="text-4xl font-semibold leading-none tracking-tight text-zinc-50"
           style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {value}
        </p>
        {unit && (
          <span className="text-base font-medium text-zinc-500">{unit}</span>
        )}
      </div>

      {/* Delta */}
      {delta && (
        <span className={cn(
          'inline-block mt-2 text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded-md',
          deltaGood === true  && 'bg-emerald-500/10 text-emerald-400',
          deltaGood === false && 'bg-rose-500/10 text-rose-400',
          !isPositive && !isNegative && 'bg-zinc-800 text-zinc-500'
        )}>
          {delta}
        </span>
      )}

      {/* Sub */}
      {sub && <p className="text-[11px] text-zinc-600 mt-2">{sub}</p>}

      {/* Línea inferior sutil */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  )
}
