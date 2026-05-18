-- ============================================================
-- Datos iniciales de Marco
-- UUID del usuario: 62c9f9f8-2393-4108-aaee-2991ee1afe74
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

DO $$
DECLARE
  uid UUID := '62c9f9f8-2393-4108-aaee-2991ee1afe74';
  meal_id UUID;
BEGIN

-- 1. Usuario
INSERT INTO users (id, email, name)
VALUES (uid, 'markii.candiani@live.com.mx', 'Marco')
ON CONFLICT (id) DO NOTHING;

-- 2. Perfil
INSERT INTO user_profile (user_id, peso_objetivo_kg, peso_objetivo_fecha, tdee_referencia_kcal, meta_kcal_semana, meta_kcal_finde, meta_proteina_g, deficit_objetivo_min, deficit_objetivo_max, watch_descuento_pct)
VALUES (uid, 84.5, '2026-07-18', 2240, 1875, 2250, 120, 3500, 5000, 20)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Catálogo de alimentos
INSERT INTO food_catalog (user_id, nombre, porcion_g, kcal, proteina_g, carbs_g, grasa_g, frecuente) VALUES
  (uid, 'Tortilla maíz mediana',    30,  65,  2,  13, 1,  true),
  (uid, 'Arroz blanco cocido',      100, 130, 3,  28, 0,  true),
  (uid, 'Frijoles negros cocidos',  100, 130, 8,  23, 1,  true),
  (uid, 'Huevo entero',             50,  70,  6,  0,  5,  true),
  (uid, 'Pechuga pollo cocida',     100, 165, 31, 0,  4,  true),
  (uid, 'Carne molida res magra',   100, 215, 22, 0,  14, true),
  (uid, 'Aguacate',                 50,  80,  1,  4,  7,  true),
  (uid, 'Pan blanco rebanada',      25,  70,  2,  13, 1,  true),
  (uid, 'Leche entera',             200, 122, 6,  10, 7,  true),
  (uid, 'Queso fresco',             30,  75,  6,  1,  5,  true),
  (uid, 'Papa cocida',              100, 87,  2,  20, 0,  true),
  (uid, 'Cerveza lata 355ml',       355, 150, 1,  13, 0,  false),
  (uid, 'Coca-Cola lata 355ml',     355, 140, 0,  37, 0,  false),
  (uid, 'Salmas Sanissimo',         6,   24,  1,  5,  0,  true),
  (uid, 'Fitmingo Birdman 1 scoop', 34,  140, 24, 3,  3,  true)
ON CONFLICT (user_id, nombre) DO NOTHING;

-- 4. Peso del día 1
INSERT INTO weight_records (user_id, fecha, peso_kg, cintura_cm, cadera_cm, cuello_cm, bicep_relajado_cm, bicep_contraido_cm, grasa_corporal_pct, grasa_corporal_kg, masa_muscular_pct, masa_osea_kg, agua_corporal_pct, grasa_visceral, tmb_basicula_kcal, bmi, edad_metabolica, nota)
VALUES (uid, '2026-05-18', 92.1, 103.5, 102.0, 46.5, 35.0, 37.0, 26.2, 24.1, 38.8, 3.1, 53.9, 14, 1947, 31.9, 46, 'Post-vacaciones Acapulco. Punto de partida oficial.')
ON CONFLICT (user_id, fecha) DO NOTHING;

-- 5. Daily summary
INSERT INTO daily_summary (user_id, fecha, dia_semana, tipo_dia, total_kcal, total_prot_g, total_carbs_g, total_grasa_g, meta_kcal_dia, meta_proteina_g, semana_numero)
VALUES (uid, '2026-05-18', 'lunes', 'semana', 354, 17.2, 23.2, 22.6, 1875, 120, 1)
ON CONFLICT (user_id, fecha) DO NOTHING;

-- 6. Desayuno
INSERT INTO meals (id, user_id, fecha, tipo, hora, total_kcal, total_prot_g, total_carbs_g, total_grasa_g)
VALUES (gen_random_uuid(), uid, '2026-05-18', 'desayuno', '10:00', 354, 17.2, 23.2, 22.6)
RETURNING id INTO meal_id;

INSERT INTO meal_items (meal_id, nombre, cantidad_g, kcal, proteina_g, carbs_g, grasa_g) VALUES
  (meal_id, 'Salmas Sanissimo', 18,  72,  3.0, 15.0, 0.0),
  (meal_id, 'Huevos revueltos', 100, 154, 12.6, 1.0, 10.6),
  (meal_id, 'Aguacate',         80,  128, 1.6,  7.2, 12.0);

RAISE NOTICE 'Migración completada para usuario %', uid;

END $$;
