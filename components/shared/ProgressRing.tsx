'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label: string
  unit?: string
  delay?: number
  colorOverride?: string
}

export default function ProgressRing({
  value,
  max,
  size = 90,
  strokeWidth = 7,
  label,
  unit = '',
  delay = 0,
  colorOverride,
}: ProgressRingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(id)
  }, [delay])

  const pct = Math.min(1, value / max)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = mounted ? circumference * (1 - pct) : circumference

  const strokeColor = colorOverride
    ?? (pct >= 1
      ? 'oklch(0.72 0.18 15)'
      : pct >= 0.9
        ? 'oklch(0.83 0.16 83)'
        : 'oklch(0.696 0.17 162)'
    )

  const displayValue = Math.round(value).toLocaleString()

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="oklch(0.21 0.008 74)"
            strokeWidth={strokeWidth}
          />
          {/* Fill — respira cuando está activo */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={pct > 0.05 ? 'ring-breathe' : ''}
            style={{
              transition: mounted
                ? 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'none',
            }}
          />
        </svg>

        {/* Valor centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-white leading-none tabular-nums"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: size >= 90 ? '1.05rem' : '0.85rem',
              letterSpacing: '-0.02em',
            }}
          >
            {displayValue}{unit}
          </span>
        </div>
      </div>

      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em]">
        {label}
      </p>
    </div>
  )
}
