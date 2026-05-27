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
    <nav className="flex items-center justify-around px-2 py-3
                    bg-zinc-950/80 backdrop-blur-2xl
                    border-t border-white/[0.04]">
      {tabs.map(({ href, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1.5 px-5 py-1.5 min-h-[44px] justify-center',
              'nav-tab'
            )}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2 : 1.4}
              className={active ? 'text-emerald-400' : 'text-zinc-700'}
            />
            {/* Dot indicador activo — Oura style */}
            <span className={cn(
              'w-1 h-1 rounded-full transition-all duration-200',
              active ? 'bg-emerald-400' : 'bg-transparent'
            )} />
          </Link>
        )
      })}
    </nav>
  )
}
