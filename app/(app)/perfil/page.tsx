import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profile').select('*').eq('user_id', user.id).maybeSingle()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any

  const items = [
    { label: 'Correo', value: user.email },
    { label: 'Peso objetivo', value: p ? `${p.peso_objetivo_kg} kg` : '84.5 kg' },
    { label: 'Kcal L–V', value: p ? `${p.meta_kcal_semana} kcal` : '1,875 kcal' },
    { label: 'Kcal Sáb–Dom', value: p ? `${p.meta_kcal_finde} kcal` : '2,250 kcal' },
    { label: 'Proteína meta', value: p ? `${p.meta_proteina_g}g` : '120g' },
    { label: 'Descuento Watch', value: p ? `${p.watch_descuento_pct}%` : '20%' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="pt-5 pb-10">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-4">
          Cuenta
        </p>
        <h1 className="text-4xl font-bold text-white tracking-tight leading-none">
          Perfil
        </h1>
      </div>

      {/* Settings list */}
      <div className="rounded-2xl overflow-hidden"
           style={{ backgroundColor: 'oklch(0.16 0.009 78)' }}>
        {items.map(({ label, value }, i) => (
          <div
            key={label}
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderTop: i > 0 ? '1px solid oklch(1 0 0 / 0.05)' : 'none',
            }}
          >
            <span className="text-sm text-zinc-500">{label}</span>
            <span
              className="text-sm font-medium text-zinc-200 tabular-nums"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 rounded-2xl px-5 py-4"
           style={{ backgroundColor: 'oklch(0.16 0.009 78)' }}>
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-1">
          Sistema
        </p>
        <p className="text-xs text-zinc-700">Marco Fitness v1.0 · Supabase</p>
      </div>
    </div>
  )
}
