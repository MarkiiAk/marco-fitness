import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrate() {
  console.log('🚀 Iniciando migración...')

  // 1. Buscar el usuario en Supabase Auth
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
  if (authError) throw new Error(`Error listando usuarios: ${authError.message}`)

  const authUser = authUsers.users[0]
  if (!authUser) throw new Error('No hay usuarios en Supabase Auth. Crea uno primero.')

  console.log(`✓ Usuario encontrado: ${authUser.email} (${authUser.id})`)
  const userId = authUser.id

  // 2. Insertar en tabla users
  const { error: userError } = await supabase
    .from('users')
    .upsert({ id: userId, email: authUser.email!, name: 'Marco' }, { onConflict: 'id' })
  if (userError) throw new Error(`Error creando usuario: ${userError.message}`)
  console.log('✓ Usuario insertado en tabla users')

  // 3. Perfil y metas
  const { error: profileError } = await supabase
    .from('user_profile')
    .upsert({
      user_id: userId,
      peso_objetivo_kg: 84.5,
      peso_objetivo_fecha: '2026-07-18',
      tdee_referencia_kcal: 2240,
      meta_kcal_semana: 1875,
      meta_kcal_finde: 2250,
      meta_proteina_g: 120,
      deficit_objetivo_min: 3500,
      deficit_objetivo_max: 5000,
      watch_descuento_pct: 20,
    }, { onConflict: 'user_id' })
  if (profileError) throw new Error(`Error creando perfil: ${profileError.message}`)
  console.log('✓ Perfil y metas insertados')

  // 4. Catálogo de alimentos
  const alimentos = [
    { nombre: 'Tortilla maíz mediana',    porcion_g: 30,  kcal: 65,  proteina_g: 2,  carbs_g: 13, grasa_g: 1,  frecuente: true },
    { nombre: 'Arroz blanco cocido',      porcion_g: 100, kcal: 130, proteina_g: 3,  carbs_g: 28, grasa_g: 0,  frecuente: true },
    { nombre: 'Frijoles negros cocidos',  porcion_g: 100, kcal: 130, proteina_g: 8,  carbs_g: 23, grasa_g: 1,  frecuente: true },
    { nombre: 'Huevo entero',             porcion_g: 50,  kcal: 70,  proteina_g: 6,  carbs_g: 0,  grasa_g: 5,  frecuente: true },
    { nombre: 'Pechuga pollo cocida',     porcion_g: 100, kcal: 165, proteina_g: 31, carbs_g: 0,  grasa_g: 4,  frecuente: true },
    { nombre: 'Carne molida res magra',   porcion_g: 100, kcal: 215, proteina_g: 22, carbs_g: 0,  grasa_g: 14, frecuente: true },
    { nombre: 'Aguacate',                 porcion_g: 50,  kcal: 80,  proteina_g: 1,  carbs_g: 4,  grasa_g: 7,  frecuente: true },
    { nombre: 'Pan blanco rebanada',      porcion_g: 25,  kcal: 70,  proteina_g: 2,  carbs_g: 13, grasa_g: 1,  frecuente: true },
    { nombre: 'Leche entera',             porcion_g: 200, kcal: 122, proteina_g: 6,  carbs_g: 10, grasa_g: 7,  frecuente: true },
    { nombre: 'Queso fresco',             porcion_g: 30,  kcal: 75,  proteina_g: 6,  carbs_g: 1,  grasa_g: 5,  frecuente: true },
    { nombre: 'Papa cocida',              porcion_g: 100, kcal: 87,  proteina_g: 2,  carbs_g: 20, grasa_g: 0,  frecuente: true },
    { nombre: 'Cerveza lata 355ml',       porcion_g: 355, kcal: 150, proteina_g: 1,  carbs_g: 13, grasa_g: 0,  frecuente: false },
    { nombre: 'Coca-Cola lata 355ml',     porcion_g: 355, kcal: 140, proteina_g: 0,  carbs_g: 37, grasa_g: 0,  frecuente: false },
    { nombre: 'Salmas Sanissimo',         porcion_g: 6,   kcal: 24,  proteina_g: 1,  carbs_g: 5,  grasa_g: 0,  frecuente: true },
    { nombre: 'Fitmingo Birdman 1 scoop', porcion_g: 34,  kcal: 140, proteina_g: 24, carbs_g: 3,  grasa_g: 3,  frecuente: true, es_suplemento: true },
  ]

  const { error: foodError } = await supabase
    .from('food_catalog')
    .upsert(alimentos.map(a => ({ ...a, user_id: userId })), { onConflict: 'user_id,nombre' })
  if (foodError) throw new Error(`Error insertando catálogo: ${foodError.message}`)
  console.log(`✓ ${alimentos.length} alimentos insertados en catálogo`)

  // 5. Registro de peso del día 1 con composición corporal completa
  const { error: weightError } = await supabase
    .from('weight_records')
    .upsert({
      user_id: userId,
      fecha: '2026-05-18',
      peso_kg: 92.1,
      cintura_cm: 103.5,
      cadera_cm: 102.0,
      cuello_cm: 46.5,
      bicep_relajado_cm: 35.0,
      bicep_contraido_cm: 37.0,
      grasa_corporal_pct: 26.2,
      grasa_corporal_kg: 24.1,
      masa_muscular_pct: 38.8,
      masa_osea_kg: 3.1,
      agua_corporal_pct: 53.9,
      grasa_visceral: 14,
      tmb_basicula_kcal: 1947,
      bmi: 31.9,
      edad_metabolica: 46,
      nota: 'Post-vacaciones Acapulco. Punto de partida oficial del sistema.',
    }, { onConflict: 'user_id,fecha' })
  if (weightError) throw new Error(`Error insertando peso: ${weightError.message}`)
  console.log('✓ Registro de peso del día 1 insertado')

  // 6. Daily summary del día 1
  const { error: summaryError } = await supabase
    .from('daily_summary')
    .upsert({
      user_id: userId,
      fecha: '2026-05-18',
      dia_semana: 'lunes',
      tipo_dia: 'semana',
      total_kcal: 354,
      total_prot_g: 17.2,
      total_carbs_g: 23.2,
      total_grasa_g: 22.6,
      meta_kcal_dia: 1875,
      meta_proteina_g: 120,
      semana_numero: 1,
    }, { onConflict: 'user_id,fecha' })
  if (summaryError) throw new Error(`Error insertando summary: ${summaryError.message}`)
  console.log('✓ Resumen del día 1 insertado')

  // 7. Desayuno del día 1
  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .upsert({
      user_id: userId,
      fecha: '2026-05-18',
      tipo: 'desayuno',
      hora: '10:00',
      total_kcal: 354,
      total_prot_g: 17.2,
      total_carbs_g: 23.2,
      total_grasa_g: 22.6,
    }, { onConflict: 'user_id,fecha,tipo' })
    .select()
    .single()
  if (mealError) throw new Error(`Error insertando comida: ${mealError.message}`)

  if (meal) {
    await supabase.from('meal_items').insert([
      { meal_id: meal.id, nombre: 'Salmas Sanissimo',  cantidad_g: 18,  kcal: 72,  proteina_g: 3.0, carbs_g: 15.0, grasa_g: 0.0 },
      { meal_id: meal.id, nombre: 'Huevos revueltos',  cantidad_g: 100, kcal: 154, proteina_g: 12.6, carbs_g: 1.0, grasa_g: 10.6 },
      { meal_id: meal.id, nombre: 'Aguacate',          cantidad_g: 80,  kcal: 128, proteina_g: 1.6,  carbs_g: 7.2, grasa_g: 12.0 },
    ])
    console.log('✓ Desayuno del día 1 insertado con items')
  }

  console.log('\n✅ Migración completada. Recarga el dashboard.')
}

migrate().catch(err => {
  console.error('❌ Error en migración:', err.message)
  process.exit(1)
})
