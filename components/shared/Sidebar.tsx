'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, PlusCircle, CalendarDays, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/chat',       label: 'Chat',       icon: MessageCircle },
  { href: '/registrar',  label: 'Registrar',  icon: PlusCircle },
  { href: '/historial',  label: 'Historial',  icon: CalendarDays },
  { href: '/perfil',     label: 'Perfil',     icon: User },
]

const PESO_INICIAL = 92.1
const PESO_META    = 84.5

export default function Sidebar({ pesoActual = PESO_INICIAL }: { pesoActual?: number }) {
  const pathname = usePathname()

  const totalBajar  = PESO_INICIAL - PESO_META
  const bajado      = Math.max(0, PESO_INICIAL - pesoActual)
  const pct         = Math.min(100, Math.round((bajado / totalBajar) * 100))
  const faltanKg    = Math.max(0, pesoActual - PESO_META).toFixed(1)

  // Mini ring SVG
  const size = 52
  const stroke = 5
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)

  return (
    <div className="flex flex-col h-full px-4 py-7"
         style={{ backgroundColor: 'oklch(0.13 0.009 80)' }}>

      {/* Wordmark */}
      <div className="px-2 mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-1">
          Sistema personal
        </p>
        <h1 className="text-base font-bold text-zinc-100 leading-none tracking-tight">
          Marco Fitness
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'nav-tab flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                active
                  ? 'text-white bg-white/[0.07]'
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]'
              )}
            >
              <Icon
                size={15}
                strokeWidth={active ? 2 : 1.5}
                className={active ? 'text-emerald-400' : ''}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Progress — mini ring + datos */}
      <div className="mt-6 px-2 pb-2">
        <div className="flex items-center gap-4">

          {/* Mini ring SVG */}
          <div className="shrink-0 relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
                 style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={size/2} cy={size/2} r={r}
                fill="none" stroke="oklch(0.21 0.008 74)" strokeWidth={stroke} />
              <circle cx={size/2} cy={size/2} r={r}
                fill="none" stroke="oklch(0.696 0.17 162)" strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                className="ring-breathe" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-400"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {pct}%
              </span>
            </div>
          </div>

          {/* Datos */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-xl font-bold text-white leading-none tabular-nums"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {pesoActual}
              </span>
              <span className="text-xs text-zinc-600">kg</span>
            </div>
            <p className="text-[10px] text-zinc-600 leading-tight">
              Faltan {faltanKg} kg
            </p>
            <p className="text-[10px] text-zinc-700">
              → {PESO_META} kg
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
