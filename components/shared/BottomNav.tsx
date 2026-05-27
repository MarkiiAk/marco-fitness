'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, PlusCircle, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard',  label: 'Inicio',    icon: LayoutDashboard },
  { href: '/chat',       label: 'Chat',      icon: MessageCircle },
  { href: '/registrar',  label: 'Registrar', icon: PlusCircle },
  { href: '/historial',  label: 'Historial', icon: CalendarDays },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex items-center justify-around px-2 py-3 border-t border-white/[0.05]"
      style={{
        backgroundColor: 'rgba(13,11,9,0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {tabs.map(({ href, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center justify-center min-h-[44px] px-5 py-1.5"
          >
            {/* Halo verde debajo del icono activo — prende y apaga */}
            {active && (
              <div
                className="tab-active-glow absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(16,185,129,0.18) 0%, transparent 75%)',
                }}
              />
            )}

            {/* Icono — respira cuando está activo */}
            <div className={active ? 'icon-active' : ''}>
              <Icon
                size={21}
                strokeWidth={active ? 2 : 1.4}
                className={active ? 'text-emerald-400' : 'text-zinc-600'}
              />
            </div>

            {/* Dot indicador */}
            <span className={cn(
              'w-1 h-1 rounded-full mt-1.5 transition-all duration-300',
              active ? 'bg-emerald-400 dot-live' : 'bg-transparent'
            )} />
          </Link>
        )
      })}
    </nav>
  )
}
