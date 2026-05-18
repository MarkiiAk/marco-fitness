import { createClient } from '@/lib/supabase/server'
import { cn, todayISO } from '@/lib/utils'

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const GYM_DAYS = [0, 1, 3, 4] // índices 0=lunes, 1=martes, 3=jueves, 4=viernes

interface WorkoutWeekViewProps {
  userId: string
}

export default async function WorkoutWeekView({ userId }: WorkoutWeekViewProps) {
  const supabase = await createClient()
  const today = new Date()
  const todayStr = todayISO()

  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() + diff)

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const { data: workouts } = await supabase
    .from('workouts')
    .select('fecha,tipo')
    .eq('user_id', userId)
    .gte('fecha', weekDates[0])
    .lte('fecha', weekDates[6])

  const workoutMap = new Map(workouts?.map((w: { fecha: string; tipo: string }) => [w.fecha, w.tipo]) ?? [])

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06]">
      <h2 className="text-sm font-semibold text-zinc-200 mb-4">Semana actual</h2>
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((fecha, i) => {
          const isGymDay = GYM_DAYS.includes(i)
          const isToday = fecha === todayStr
          const isPast = fecha < todayStr
          const workout = workoutMap.get(fecha)
          const isRestDay = !isGymDay

          return (
            <div key={fecha} className="flex flex-col items-center gap-1.5">
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wide',
                isToday ? 'text-zinc-300' : 'text-zinc-600'
              )}>
                {DIAS[i]}
              </span>
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all',
                workout && 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
                !workout && isToday && isGymDay && 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/40',
                !workout && isPast && isGymDay && 'bg-rose-500/10 text-rose-500',
                !workout && !isPast && isGymDay && !isToday && 'bg-zinc-800/40 text-zinc-600',
                isRestDay && 'bg-transparent text-zinc-700',
              )}>
                {workout ? '✓' : isRestDay ? '·' : isToday ? '→' : isPast ? '✗' : '·'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
