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
  /** Override color logic — useful for deficit which has a different "good" range */
  colorOverride?: string
}

export default function ProgressRing({
  value,
  max,
  size = 88,
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
      ? 'oklch(0.72 0.18 15)'      // rose — over limit
      : pct >= 0.9
        ? 'oklch(0.83 0.16 83)'    // amber — close to limit
        : 'oklch(0.696 0.17 162)'  // emerald — nominal
    )

  const displayValue = Math.round(value).toLocaleString()

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.235 0 0)"
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: mounted
                ? 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'none',
            }}
          />
        </svg>

        {/* Valor centrado */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span
            className="font-bold text-white leading-none tabular-nums"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: size >= 88 ? '1rem' : '0.8rem',
              letterSpacing: '-0.02em',
            }}
          >
            {displayValue}{unit}
          </span>
        </div>
      </div>

      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
        {label}
      </p>
    </div>
  )
}
