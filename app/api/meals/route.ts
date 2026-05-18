import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { todayISO, getDiaSemana, getTipoDia } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { items, ...mealData } = body
  const today = todayISO()

  // Calcular totales de la comida
  const totales = (items ?? []).reduce(
    (acc: Record<string, number>, item: Record<string, number>) => ({
      kcal: acc.kcal + (item.kcal ?? 0),
      proteina_g: acc.proteina_g + (item.proteina_g ?? 0),
      carbs_g: acc.carbs_g + (item.carbs_g ?? 0),
      grasa_g: acc.grasa_g + (item.grasa_g ?? 0),
    }),
    { kcal: 0, proteina_g: 0, carbs_g: 0, grasa_g: 0 }
  )

  // Crear la comida
  const { data: meal, error } = await supabase
    .from('meals')
    .insert({
      user_id: user.id,
      fecha: today,
      total_kcal: totales.kcal,
      total_prot_g: totales.proteina_g,
      total_carbs_g: totales.carbs_g,
      total_grasa_g: totales.grasa_g,
      ...mealData,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insertar items
  if (items?.length && meal) {
    await supabase
      .from('meal_items')
      .insert(items.map((item: Record<string, unknown>) => ({ meal_id: meal.id, ...item })))
  }

  // Recalcular totales del día en daily_summary
  const { data: allMeals } = await supabase
    .from('meals')
    .select('total_kcal,total_prot_g,total_carbs_g,total_grasa_g')
    .eq('user_id', user.id)
    .eq('fecha', today)

  const dayTotals = (allMeals ?? []).reduce(
    (acc: Record<string, number>, m: Record<string, number>) => ({
      kcal: acc.kcal + (m.total_kcal ?? 0),
      prot: acc.prot + (m.total_prot_g ?? 0),
      carbs: acc.carbs + (m.total_carbs_g ?? 0),
      grasa: acc.grasa + (m.total_grasa_g ?? 0),
    }),
    { kcal: 0, prot: 0, carbs: 0, grasa: 0 }
  )

  await supabase
    .from('daily_summary')
    .upsert({
      user_id: user.id,
      fecha: today,
      dia_semana: getDiaSemana(today),
      tipo_dia: getTipoDia(today),
      total_kcal: dayTotals.kcal,
      total_prot_g: dayTotals.prot,
      total_carbs_g: dayTotals.carbs,
      total_grasa_g: dayTotals.grasa,
      meta_kcal_dia: 1875,
      meta_proteina_g: 120,
    }, { onConflict: 'user_id,fecha' })

  return NextResponse.json({ meal, totales_dia: dayTotals })
}
