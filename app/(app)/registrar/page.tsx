import Link from 'next/link'
import { Utensils, Scale, Dumbbell } from 'lucide-react'

const opciones = [
  {
    href: '/registrar/comida',
    icon: Utensils,
    label: 'Comida',
    sub: 'Lo que comiste hoy',
    iconColor: 'text-emerald-400',
    iconBg: 'oklch(0.696 0.17 162 / 0.12)',
  },
  {
    href: '/registrar/peso',
    icon: Scale,
    label: 'Peso',
    sub: 'Peso y medidas',
    iconColor: 'text-sky-400',
    iconBg: 'oklch(0.68 0.15 220 / 0.12)',
  },
  {
    href: '/registrar/entreno',
    icon: Dumbbell,
    label: 'Entreno',
    sub: 'Sesión de gym y cardio',
    iconColor: 'text-amber-400',
    iconBg: 'oklch(0.83 0.16 83 / 0.12)',
  },
]

export default function RegistrarPage() {
  return (
    <div>
      {/* Header */}
      <div className="pt-5 pb-10">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-4">
          Registrar
        </p>
        <h1 className="text-4xl font-bold text-white tracking-tight leading-none">
          ¿Qué anotas?
        </h1>
      </div>

      <div className="space-y-2.5">
        {opciones.map(({ href, icon: Icon, label, sub, iconColor, iconBg }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors duration-150 active:scale-[0.99]"
            style={{ backgroundColor: 'oklch(0.16 0.009 78)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'oklch(0.19 0.009 76)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'oklch(0.16 0.009 78)')}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: iconBg }}
            >
              <Icon size={18} className={iconColor} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zinc-100 text-sm">{label}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
            </div>
            <span className="text-zinc-700 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
