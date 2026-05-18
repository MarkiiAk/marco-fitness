-- ============================================================
-- MARCO FITNESS — Seed inicial del catálogo de alimentos
-- Migración 002: Alimentos base de la dieta mexicana de Marco
-- ============================================================
-- IMPORTANTE: Reemplazar :user_id con el UUID real de Marco
-- después de crear el usuario en Supabase Auth.
-- ============================================================

INSERT INTO food_catalog (user_id, nombre, porcion_g, kcal, proteina_g, carbs_g, grasa_g, frecuente) VALUES
  (:user_id, 'Tortilla maíz mediana',    30,  65, 2,  13, 1, true),
  (:user_id, 'Arroz blanco cocido',      100, 130, 3, 28, 0, true),
  (:user_id, 'Frijoles negros cocidos',  100, 130, 8, 23, 1, true),
  (:user_id, 'Huevo entero',             50,  70,  6,  0, 5, true),
  (:user_id, 'Pechuga pollo cocida',     100, 165, 31, 0, 4, true),
  (:user_id, 'Carne molida res magra',   100, 215, 22, 0, 14, true),
  (:user_id, 'Aguacate',                 50,  80,  1,  4, 7, true),
  (:user_id, 'Pan blanco rebanada',      25,  70,  2, 13, 1, true),
  (:user_id, 'Leche entera',             200, 122, 6, 10, 7, true),
  (:user_id, 'Queso fresco',             30,  75,  6,  1, 5, true),
  (:user_id, 'Papa cocida',              100, 87,  2, 20, 0, true),
  (:user_id, 'Cerveza lata 355ml',       355, 150, 1, 13, 0, false),
  (:user_id, 'Coca-Cola lata 355ml',     355, 140, 0, 37, 0, false),
  (:user_id, 'Salmas Sanissimo',         6,   24,  1,  5, 0, true),
  (:user_id, 'Fitmingo Birdman 1 scoop', 34,  140, 24, 3, 3, true)
ON CONFLICT (user_id, nombre) DO NOTHING;
