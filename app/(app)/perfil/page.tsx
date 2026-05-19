import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Cuenta</p>
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight leading-none">Perfil</h1>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] divide-y divide-white/[0.04]">
        {[
          { label: 'Correo', value: user.email },
          { label: 'Peso objetivo', value: p ? `${p.peso_objetivo_kg} kg` : '84.5 kg' },
          { label: 'Meta calórica L-V', value: p ? `${p.meta_kcal_semana} kcal` : '1,875 kcal' },
          { label: 'Meta calórica Sáb-Dom', value: p ? `${p.meta_kcal_finde} kcal` : '2,250 kcal' },
          { label: 'Meta proteína', value: p ? `${p.meta_proteina_g}g` : '120g' },
          { label: 'Descuento Watch', value: p ? `${p.watch_descuento_pct}%` : '20%' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-zinc-500">{label}</span>
            <span className="text-sm font-medium text-zinc-200 tabular-nums"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] divide-y divide-white/[0.04]">
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Sistema</p>
          <p className="text-xs text-zinc-600">Marco Fitness v1.0 · Datos en Supabase</p>
        </div>
      </div>
    </div>
  )
}
