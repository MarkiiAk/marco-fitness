import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { todayISO } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { ejercicios, ...workoutData } = body
  const today = todayISO()

  // Insertar el entreno
  const { data: workout, error } = await supabase
    .from('workouts')
    .upsert({
      user_id: user.id,
      fecha: today,
      ...workoutData,
    }, { onConflict: 'user_id,fecha,tipo' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insertar ejercicios si los hay
  if (ejercicios?.length && workout) {
    await supabase
      .from('workout_exercises')
      .insert(
        ejercicios.map((e: Record<string, unknown>) => ({
          workout_id: workout.id,
          ...e,
        }))
      )
  }

  // Actualizar daily_summary con calorías del entreno
  if (workoutData.calorias_reales) {
    await supabase
      .from('daily_summary')
      .upsert({
        user_id: user.id,
        fecha: today,
        calorias_watch_raw: workoutData.calorias_watch,
        calorias_watch_adj: workoutData.calorias_reales,
        circulos_cerrados: workoutData.circulos_cerrados,
      }, { onConflict: 'user_id,fecha' })
  }

  return NextResponse.json(workout)
}
