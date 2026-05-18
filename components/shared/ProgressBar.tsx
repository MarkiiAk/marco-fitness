import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showValues?: boolean
  formatValue?: (v: number) => string
  className?: string
}

export default function ProgressBar({
  value, max, label, showValues = true, formatValue = (v) => String(Math.round(v)), className
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const color = pct >= 100
    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
    : pct >= 90
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
      : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'

  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || showValues) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-zinc-400">{label}</span>}
          {showValues && (
            <span className="text-xs text-zinc-500 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {formatValue(value)} / {formatValue(max)}
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
