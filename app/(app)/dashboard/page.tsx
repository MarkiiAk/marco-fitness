import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { todayISO, formatKg, formatKcal, formatDelta } from '@/lib/utils'
import StatCard from '@/components/shared/StatCard'
import ProgressBar from '@/components/shared/ProgressBar'
import WeightChart from '@/components/dashboard/WeightChart'
import DeficitChart from '@/components/dashboard/DeficitChart'
import WorkoutWeekView from '@/components/dashboard/WorkoutWeekView'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = todayISO()

  // Calcular lunes y domingo de la semana actual (independiente de daily_summary)
  const todayDate = new Date()
  const dayOfWeek = todayDate.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(todayDate)
  monday.setDate(todayDate.getDate() + diffToMonday)
  const mondayStr = monday.toISOString().split('T')[0]
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const sundayStr = sunday.toISOString().split('T')[0]

  // Cargar datos base primero (daily_summary de hoy para kcal/proteína)
  const { data: todaySummary } = await supabase
    .from('daily_summary').select('*').eq('user_id', user.id).eq('fecha', today).maybeSingle()

  // Cargar el resto en paralelo
  const [
    { data: todayWeight },
    { data: yesterdayWeight },
    { data: weightHistory },
    { data: weeklySummary },
    { data: todayWorkout },
    { data: profile },
  ] = await Promise.all([
    supabase.from('weight_records').select('*').eq('user_id', user.id).eq('fecha', today).maybeSingle(),
    supabase.from('weight_records').select('*').eq('user_id', user.id).order('fecha', { ascending: false }).limit(2),
    supabase.from('weight_records').select('fecha,peso_kg,cintura_cm').eq('user_id', user.id).order('fecha', { ascending: true }).limit(60),
    supabase.from('daily_summary').select('*').eq('user_id', user.id).gte('fecha', mondayStr).lte('fecha', sundayStr).order('fecha', { ascending: true }),
    supabase.from('workouts').select('*').eq('user_id', user.id).eq('fecha', today).maybeSingle(),
    supabase.from('user_profile').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any
  const metaKcal: number = p?.meta_kcal_semana ?? 1875
  const metaProt: number = p?.meta_proteina_g ?? 120
  const pesoInicial = 92.1
  const pesoMeta: number = p?.peso_objetivo_kg ?? 84.5

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ts = todaySummary as any
  const kcalHoy: number = ts?.total_kcal ?? 0
  const protHoy: number = ts?.total_prot_g ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deficitSemana: number = (weeklySummary as any[])?.reduce((acc: number, d: any) => acc + (d.deficit_real_kcal ?? 0), 0) ?? 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tw = todayWeight as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yw = yesterdayWeight as any[]
  const prevWeight = Array.isArray(yw) ? yw[1] : null
  const pesoDelta = tw && prevWeight
    ? formatDelta(tw.peso_kg, prevWeight.peso_kg, ' kg')
    : undefined

  return (
    <div className="space-y-5">
      {/* Header — invertido estilo Oura/Apple Fitness */}
      <div className="pt-2 pb-1">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1 capitalize">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight leading-none">Hoy</h1>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Peso"
          value={tw ? `${tw.peso_kg}` : '—'}
          unit="kg"
          delta={pesoDelta}
          deltaPositiveIsGood={false}
          sub={tw ? `Meta: ${pesoMeta} kg` : 'Sin registro hoy'}
        />
        <StatCard
          label="Cintura"
          value={tw?.cintura_cm ? `${tw.cintura_cm}` : '—'}
          unit="cm"
          deltaPositiveIsGood={false}
          sub="Inicio: 103.5 cm"
        />
      </div>

      {/* Calorías del día */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06] space-y-4
                      before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:pointer-events-none
                      before:bg-gradient-to-r before:from-transparent before:via-emerald-500/30 before:to-transparent">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-zinc-200">Calorías hoy</h2>
          <span className="text-xs text-zinc-500 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {Math.round(metaKcal - kcalHoy)} restantes
          </span>
        </div>
        <ProgressBar
          value={kcalHoy}
          max={metaKcal}
          label="Consumidas"
          formatValue={(v) => `${Math.round(v)} kcal`}
        />
        <ProgressBar
          value={protHoy}
          max={metaProt}
          label="Proteína"
          formatValue={(v) => `${Math.round(v)}g`}
        />
      </div>

      {/* Déficit semanal */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-zinc-200">Déficit semanal</h2>
          <span className={`text-xs font-semibold tabular-nums ${deficitSemana >= 3500 ? 'text-emerald-400' : 'text-amber-400'}`}
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {deficitSemana >= 3500 ? '✓ Meta' : `Faltan ${(3500 - deficitSemana).toLocaleString()} kcal`}
          </span>
        </div>
        <ProgressBar
          value={Math.max(0, deficitSemana)}
          max={5000}
          label="Déficit acumulado"
          formatValue={(v) => `${Math.round(v).toLocaleString()} kcal`}
        />
        <div className="flex justify-between text-[11px] text-zinc-600">
          <span>Mín 3,500</span>
          <span>Óptimo 5,000</span>
        </div>
      </div>

      {/* Entreno */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06]">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-zinc-300">Entreno hoy</h2>
          {todayWorkout ? (
            <span className="text-xs text-emerald-400 font-medium">✓ Completado</span>
          ) : (
            <Link href="/registrar/entreno" className="text-xs text-emerald-400 font-medium">
              Registrar →
            </Link>
          )}
        </div>
        {todayWorkout ? (
          <p className="text-sm text-zinc-400 mt-1 capitalize">{todayWorkout.tipo.replace('_', ' ')}</p>
        ) : (
          <p className="text-sm text-zinc-600 mt-1">Sin registro todavía</p>
        )}
      </div>

      {/* Gráfica de peso */}
      {weightHistory && weightHistory.length > 1 && (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06]">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Curva de peso</h2>
          <WeightChart
            data={weightHistory}
            pesoInicial={pesoInicial}
            pesoMeta={pesoMeta}
          />
        </div>
      )}

      {/* Heatmap entrenos */}
      <WorkoutWeekView userId={user.id} />

      {/* Botón registrar */}
      <Link
        href="/registrar"
        className="flex items-center justify-center w-full py-4
                   bg-emerald-500 hover:bg-emerald-400
                   text-white font-semibold text-base tracking-wide
                   rounded-2xl transition-all duration-200
                   shadow-[0_0_20px_rgba(16,185,129,0.3)]
                   hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]
                   active:scale-[0.98]"
      >
        + Registrar
      </Link>
    </div>
  )
}
