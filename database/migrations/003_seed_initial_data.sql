-- ============================================================
-- MARCO FITNESS — Datos iniciales de Marco
-- Migración 003: Peso, medidas y primer registro del día
-- ============================================================
-- Reemplazar :user_id con el UUID real de Marco.
-- ============================================================

-- Perfil y metas
INSERT INTO user_profile (
  user_id, peso_objetivo_kg, peso_objetivo_fecha,
  tdee_referencia_kcal, meta_kcal_semana, meta_kcal_finde,
  meta_proteina_g, deficit_objetivo_min, deficit_objetivo_max,
  watch_descuento_pct
) VALUES (
  :user_id, 84.5, '2026-07-18',
  2240, 1875, 2250,
  120, 3500, 5000,
  20
) ON CONFLICT (user_id) DO NOTHING;

-- Registro inicial de peso (2026-05-18) con composición corporal completa
INSERT INTO weight_records (
  user_id, fecha,
  peso_kg, cintura_cm, cadera_cm, cuello_cm,
  bicep_relajado_cm, bicep_contraido_cm,
  grasa_corporal_pct, grasa_corporal_kg,
  masa_muscular_pct, masa_osea_kg,
  agua_corporal_pct, grasa_visceral,
  tmb_basicula_kcal, bmi, edad_metabolica,
  nota
) VALUES (
  :user_id, '2026-05-18',
  92.1, 103.5, 102.0, 46.5,
  35.0, 37.0,
  26.2, 24.1,
  38.8, 3.1,
  53.9, 14,
  1947, 31.9, 46,
  'Post-vacaciones Acapulco. Punto de partida oficial del sistema.'
) ON CONFLICT (user_id, fecha) DO NOTHING;

-- Primer desayuno registrado
INSERT INTO meals (user_id, fecha, tipo, hora, total_kcal, total_prot_g, total_carbs_g, total_grasa_g)
VALUES (:user_id, '2026-05-18', 'desayuno', '10:00', 354, 17.2, 23.2, 22.6)
RETURNING id;

-- Nota: los meal_items del desayuno se insertan referenciando el id de la meal anterior.
-- Usar el id retornado arriba como :meal_id en el siguiente bloque:

-- INSERT INTO meal_items (meal_id, nombre, cantidad_g, kcal, proteina_g, carbs_g, grasa_g) VALUES
--   (:meal_id, 'Salmas Sanissimo',  18,  72,  3.0, 15.0,  0.0),
--   (:meal_id, 'Huevos revueltos',  100, 154, 12.6, 1.0, 10.6),
--   (:meal_id, 'Aguacate',          80,  128,  1.6,  7.2, 12.0);

-- Resumen del día inicial
INSERT INTO daily_summary (
  user_id, fecha, dia_semana, tipo_dia,
  total_kcal, total_prot_g, total_carbs_g, total_grasa_g,
  meta_kcal_dia, meta_proteina_g, semana_numero
) VALUES (
  :user_id, '2026-05-18', 'lunes', 'semana',
  354, 17.2, 23.2, 22.6,
  1875, 120, 1
) ON CONFLICT (user_id, fecha) DO NOTHING;
