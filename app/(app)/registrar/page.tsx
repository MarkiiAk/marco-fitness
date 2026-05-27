import Link from 'next/link'
import { Utensils, Scale, Dumbbell } from 'lucide-react'

const opciones = [
  {
    href: '/registrar/comida',
    icon: Utensils,
    label: 'Comida',
    sub: 'Lo que comiste hoy',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    href: '/registrar/peso',
    icon: Scale,
    label: 'Peso',
    sub: 'Peso y medidas',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10',
  },
  {
    href: '/registrar/entreno',
    icon: Dumbbell,
    label: 'Entreno',
    sub: 'Sesión de gym y cardio',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
]

export default function RegistrarPage() {
  return (
    <div>
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
            className="warm-card flex items-center gap-4 rounded-2xl px-5 py-4 active:scale-[0.99]"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
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
