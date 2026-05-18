'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, PlusCircle, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard',  label: 'Inicio',    icon: LayoutDashboard },
  { href: '/chat',       label: 'Chat',      icon: MessageCircle },
  { href: '/registrar',  label: 'Registrar', icon: PlusCircle, primary: true },
  { href: '/historial',  label: 'Historial', icon: CalendarDays },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-zinc-950/90 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around px-2 py-2">
      {tabs.map(({ href, label, icon: Icon, primary }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors',
              primary && 'relative',
              active ? 'text-emerald-400' : 'text-zinc-600'
            )}
          >
            {primary ? (
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center
                              shadow-[0_0_16px_rgba(16,185,129,0.4)] -mt-5">
                <Icon size={22} className="text-white" strokeWidth={2} />
              </div>
            ) : (
              <Icon size={20} strokeWidth={active ? 2 : 1.6} />
            )}
            {!primary && <span className="text-[10px] font-medium">{label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
