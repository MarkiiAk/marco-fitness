import { createClient } from '@/lib/supabase/server'
import { cn, todayISO } from '@/lib/utils'

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const GYM_DAYS = [0, 1, 3, 4]

interface WorkoutWeekViewProps {
  userId: string
}

export default async function WorkoutWeekView({ userId }: WorkoutWeekViewProps) {
  const supabase = await createClient()
  const todayStr = todayISO()
  const today = new Date(todayStr + 'T12:00:00')

  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() + diff)

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const [{ data: workouts }, { data: summaries }] = await Promise.all([
    supabase.from('workouts').select('fecha,tipo').eq('user_id', userId)
      .gte('fecha', weekDates[0]).lte('fecha', weekDates[6]),
    supabase.from('daily_summary').select('fecha,dia_cerrado').eq('user_id', userId)
      .gte('fecha', weekDates[0]).lte('fecha', weekDates[6]),
  ])

  const workoutMap = new Map(workouts?.map((w: { fecha: string; tipo: string }) => [w.fecha, w.tipo]) ?? [])
  const closedDays = new Set(
    summaries?.filter((s: { fecha: string; dia_cerrado: boolean }) => s.dia_cerrado)
      .map((s: { fecha: string; dia_cerrado: boolean }) => s.fecha) ?? []
  )

  return (
    <div className="px-1">
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-5">
        Semana
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {weekDates.map((fecha, i) => {
          const isGymDay = GYM_DAYS.includes(i)
          const isToday = fecha === todayStr
          const isPast = fecha < todayStr
          const workout = workoutMap.get(fecha)
          const isClosed = closedDays.has(fecha)
          const isRestDay = !isGymDay
          const isSuccess = isGymDay && (!!workout || isClosed)

          return (
            <div key={fecha} className="flex flex-col items-center gap-2">
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-widest',
                isToday ? 'text-zinc-200' : 'text-zinc-500'
              )}>
                {DIAS[i]}
              </span>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold',
                isSuccess && 'bg-emerald-500/20 text-emerald-400',
                !isSuccess && isToday && isGymDay && 'bg-amber-500/10 text-amber-400',
                !isSuccess && isPast && isGymDay && 'bg-rose-500/10 text-rose-500/60',
                !isSuccess && !isPast && isGymDay && !isToday && 'bg-zinc-800/30 text-zinc-500',
                isRestDay && 'text-zinc-600',
              )}>
                {isSuccess ? '✓' : isRestDay ? '·' : isToday ? '·' : isPast ? '✗' : '·'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
