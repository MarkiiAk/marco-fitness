import Link from 'next/link'
import { Utensils, Scale, Dumbbell } from 'lucide-react'

const opciones = [
  {
    href: '/registrar/comida',
    icon: Utensils,
    label: 'Comida',
    sub: 'Registrar lo que comiste',
    color: 'emerald',
  },
  {
    href: '/registrar/peso',
    icon: Scale,
    label: 'Peso',
    sub: 'Peso y medidas del día',
    color: 'sky',
  },
  {
    href: '/registrar/entreno',
    icon: Dumbbell,
    label: 'Entreno',
    sub: 'Sesión de gym y cardio',
    color: 'amber',
  },
]

export default function RegistrarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Registrar</h1>
        <p className="text-sm text-zinc-500 mt-1">¿Qué quieres anotar?</p>
      </div>

      <div className="space-y-3">
        {opciones.map(({ href, icon: Icon, label, sub, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
          >
            <div className={`p-3 rounded-xl bg-${color}-500/10`}>
              <Icon size={24} className={`text-${color}-400`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-semibold text-zinc-100">{label}</p>
              <p className="text-sm text-zinc-500">{sub}</p>
            </div>
            <span className="ml-auto text-zinc-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
