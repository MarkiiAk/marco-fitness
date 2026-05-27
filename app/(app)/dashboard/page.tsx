import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { todayISO, formatDelta } from '@/lib/utils'
import ProgressRing from '@/components/shared/ProgressRing'
import WeightChart from '@/components/dashboard/WeightChart'
import WorkoutWeekView from '@/components/dashboard/WorkoutWeekView'
import ThemeToggle from '@/components/shared/ThemeToggle'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = todayISO()

  // Hora CDMX
  const nowCDMX = new Date().toLocaleTimeString('es-MX', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const todayDate = new Date(today + 'T12:00:00')
  const dayOfWeek = todayDate.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(todayDate)
  monday.setDate(todayDate.getDate() + diffToMonday)
  const mondayStr = monday.toISOString().split('T')[0]
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const sundayStr = sunday.toISOString().split('T')[0]

  const { data: todaySummary } = await supabase
    .from('daily_summary').select('*').eq('user_id', user.id).eq('fecha', today).maybeSingle()

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
  const pesoBajando = pesoDelta?.startsWith('-')
  const metaDeficit = deficitSemana >= 3500

  // Color del ring de déficit: verde cuando alcanza mínimo, ámbar cuando falta
  const deficitRingColor = metaDeficit
    ? 'oklch(0.696 0.17 162)'   // verde — meta alcanzada
    : deficitSemana / 5000 >= 0.5
      ? 'oklch(0.83 0.16 83)'   // ámbar — va en camino
      : 'oklch(0.556 0 0)'      // gris — apenas empieza

  return (
    <div className="pb-6">

      {/* ── Header — minimalista, solo datos ─────────────────────────
           Sin "Hoy" gritando. La fecha y la hora. El dato habla solo. */}
      <div className="pt-5 pb-10 flex items-start justify-between">
        <p className="text-sm font-medium text-zinc-400 capitalize leading-tight">
          {new Date(today + 'T12:00:00').toLocaleDateString('es-MX', {
            weekday: 'long', day: 'numeric', month: 'long'
          })}
        </p>
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium text-zinc-500 tabular-nums"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {nowCDMX}
          </span>
          {/* ThemeToggle visible solo en mobile (md:hidden), en desktop va en sidebar */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ── Peso — flota en el fondo, sin card ───────────────────────
           Oura-like: el número sobre el fondo oscuro directamente. */}
      <div className="mb-14">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-4">
          Peso
        </p>

        <div className="flex items-end gap-2.5">
          <span
            className={`font-bold leading-none text-white tabular-nums${pesoBajando ? ' peso-bajando' : ''}`}
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 'clamp(3.5rem, 15vw, 5rem)',
              letterSpacing: '-0.03em',
            }}
          >
            {tw ? tw.peso_kg : '—'}
          </span>
          <span className="text-xl font-medium text-zinc-500 mb-1.5">kg</span>
        </div>

        <div className="flex items-center gap-4 mt-4">
          {pesoDelta ? (
            <span
              className={`text-sm font-bold tabular-nums flex items-center gap-1.5 ${pesoBajando ? 'text-emerald-400' : 'text-rose-400'}`}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              <span>{pesoBajando ? '↓' : '↑'}</span>
              {pesoDelta}
            </span>
          ) : null}

          {tw ? (
            <span className="text-xs text-zinc-600">
              meta {pesoMeta} kg
              {tw.cintura_cm ? (
                <span className="ml-3 text-zinc-700">
                  cintura {tw.cintura_cm} cm
                </span>
              ) : null}
            </span>
          ) : (
            <Link href="/registrar/peso"
              className="text-xs text-zinc-600 hover:text-emerald-400 transition-colors">
              Sin registro · anotar →
            </Link>
          )}
        </div>
      </div>

      {/* ── 3 Rings — Calorías · Proteína · Déficit ──────────────────
           El cambio real. Rings SVG en vez de barras. Oura-style. */}
      <div className="flex justify-around items-start mb-14 px-4">
        <ProgressRing
          value={kcalHoy}
          max={metaKcal}
          label="Calorías"
          delay={80}
        />
        <ProgressRing
          value={protHoy}
          max={metaProt}
          label="Proteína"
          unit="g"
          delay={220}
        />
        <ProgressRing
          value={Math.max(0, deficitSemana)}
          max={5000}
          label="Déficit"
          delay={360}
          colorOverride={deficitRingColor}
        />
      </div>

      {/* ── Entreno — inline, sin card ───────────────────────────────── */}
      <div className="flex items-center justify-between mb-14 px-1">
        <div>
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-2">
            Entreno
          </p>
          {todayWorkout ? (
            <p className="text-sm font-semibold text-zinc-300 capitalize">
              {(todayWorkout as any).tipo.replaceAll('_', ' ')}
            </p>
          ) : (
            <p className="text-sm text-zinc-700">Sin registro</p>
          )}
        </div>

        {todayWorkout ? (
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-80" />
            Listo
          </span>
        ) : (
          <Link href="/registrar/entreno"
            className="text-xs font-bold text-zinc-600 hover:text-emerald-400 transition-colors uppercase tracking-[0.15em]">
            Registrar
          </Link>
        )}
      </div>

      {/* ── Semana ───────────────────────────────────────────────────── */}
      <div className="mb-14">
        <WorkoutWeekView userId={user.id} />
      </div>

      {/* ── Curva de peso ────────────────────────────────────────────── */}
      {weightHistory && weightHistory.length > 1 && (
        <div className="mb-14">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-5 px-1">
            Progreso
          </p>
          <WeightChart
            data={weightHistory}
            pesoInicial={pesoInicial}
            pesoMeta={pesoMeta}
          />
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Link
        href="/registrar"
        className="btn-tactile flex items-center justify-center w-full py-5
                   bg-emerald-500 hover:bg-emerald-400 hover:text-zinc-900
                   text-white font-bold text-sm tracking-[0.18em] uppercase
                   rounded-2xl
                   shadow-[0_0_24px_oklch(0.696_0.17_162_/_0.25)]"
      >
        Registrar
      </Link>

    </div>
  )
}
