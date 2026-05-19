import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HistorialFechaPage({ params }: { params: Promise<{ fecha: string }> }) {
  const { fecha } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: summary },
    { data: weight },
    { data: meals },
    { data: workout },
  ] = await Promise.all([
    supabase.from('daily_summary').select('*').eq('user_id', user.id).eq('fecha', fecha).maybeSingle(),
    supabase.from('weight_records').select('*').eq('user_id', user.id).eq('fecha', fecha).maybeSingle(),
    supabase.from('meals').select('*, meal_items(*)').eq('user_id', user.id).eq('fecha', fecha).order('hora'),
    supabase.from('workouts').select('*, workout_exercises(*)').eq('user_id', user.id).eq('fecha', fecha).maybeSingle(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = summary as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = weight as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wk = workout as any

  const deficit = s?.deficit_real_kcal ?? 0
  const deficitColor = deficit >= 700 ? 'text-emerald-400' : deficit >= 100 ? 'text-amber-400' : 'text-rose-400'

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Historial</p>
        <h1 className="text-2xl font-bold text-zinc-50 tracking-tight leading-none capitalize">
          {formatDate(fecha)}
        </h1>
      </div>

      {/* Peso y medidas */}
      {w && (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] p-5">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-3">Medidas</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Peso', value: `${w.peso_kg} kg` },
              { label: 'Cintura', value: w.cintura_cm ? `${w.cintura_cm} cm` : '—' },
              { label: 'Cadera', value: w.cadera_cm ? `${w.cadera_cm} cm` : '—' },
              { label: 'Grasa visceral', value: w.grasa_visceral ?? '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-zinc-600">{label}</p>
                <p className="text-lg font-semibold text-zinc-200" style={{ fontFamily: 'var(--font-geist-mono)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Balance del día */}
      {s && (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] p-5">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-3">Balance</p>
          <div className="space-y-2">
            {[
              { label: 'Calorías consumidas', value: `${Math.round(s.total_kcal)} kcal` },
              { label: 'Proteína', value: `${Math.round(s.total_prot_g)}g` },
              { label: 'Quemado Watch (real)', value: s.calorias_watch_adj ? `${s.calorias_watch_adj} kcal` : '—' },
              { label: 'Déficit real', value: deficit ? `${deficit} kcal` : '—', color: deficitColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">{label}</span>
                <span className={cn('text-sm font-semibold tabular-nums', color ?? 'text-zinc-200')}
                      style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comidas */}
      {meals && meals.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06]">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] px-5 pt-4 pb-2">Comidas</p>
          <div className="divide-y divide-white/[0.04]">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {meals.map((meal: any) => (
              <div key={meal.id} className="px-5 py-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-zinc-200 capitalize">{meal.tipo}</p>
                  <p className="text-sm font-semibold text-zinc-400 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {Math.round(meal.total_kcal)} kcal · {Math.round(meal.total_prot_g)}g prot
                  </p>
                </div>
                {meal.meal_items?.map((item: any) => (
                  <p key={item.id} className="text-xs text-zinc-600">
                    {item.nombre} ({item.cantidad_g}g) — {item.kcal} kcal
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entreno */}
      {wk && (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] p-5">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-2">Entreno</p>
          <p className="text-sm font-semibold text-zinc-200 capitalize mb-2">{wk.tipo?.replace('_', ' ')}</p>
          {wk.duracion_min && <p className="text-xs text-zinc-600">{wk.duracion_min} min</p>}
          {wk.calorias_watch && (
            <p className="text-xs text-zinc-600">
              Watch total: {wk.calorias_watch} kcal → real: {wk.calorias_reales} kcal
            </p>
          )}
          {wk.hombro_estado && wk.hombro_estado !== 'ok' && (
            <p className="text-xs text-amber-500 mt-1">Hombro: {wk.hombro_estado}</p>
          )}
        </div>
      )}

      {!s && !w && !meals?.length && !wk && (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] p-8 text-center">
          <p className="text-zinc-600 text-sm">Sin datos para este día</p>
        </div>
      )}
    </div>
  )
}
