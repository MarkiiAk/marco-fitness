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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-white/[0.06] px-3 py-6">
      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0
                          shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-50 leading-none">Marco Fitness</h1>
            <p className="text-[10px] text-zinc-600 mt-0.5">Sistema personal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              )}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.6} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Meta progreso */}
      <div className="mx-3 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Meta</p>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold text-zinc-50" style={{ fontFamily: 'var(--font-geist-mono)' }}>84.5</span>
          <span className="text-xs text-zinc-500">kg</span>
        </div>
        <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]"
               style={{ width: `${Math.round(((92.1 - 92.1) / (92.1 - 84.5)) * 100)}%` }} />
        </div>
        <p className="text-[10px] text-zinc-600 mt-1.5">92.1 → 84.5 kg</p>
      </div>
    </div>
  )
}
