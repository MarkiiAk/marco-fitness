import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { todayISO, getDiaSemana, getTipoDia } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const fecha = body.fecha ?? todayISO()

  const { data, error } = await supabase
    .from('weight_records')
    .upsert({
      user_id: user.id,
      fecha,
      ...body,
    }, { onConflict: 'user_id,fecha' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase
    .from('daily_summary')
    .upsert({
      user_id: user.id,
      fecha,
      dia_semana: getDiaSemana(fecha),
      tipo_dia: getTipoDia(fecha),
      semana_numero: getWeekNumber(),
    }, { onConflict: 'user_id,fecha' })

  return NextResponse.json(data)
}

function getWeekNumber(): number {
  // Semana relativa al inicio del programa (2026-05-18)
  const startDate = new Date('2026-05-18')
  const today = new Date()
  const diffMs = today.getTime() - startDate.getTime()
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
}
