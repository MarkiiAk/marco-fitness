-- ============================================================
-- MARCO FITNESS — Schema inicial
-- Migración 001: Tablas base del sistema
-- ============================================================
-- Portable: este SQL corre en cualquier PostgreSQL estándar.
-- Para migrar de Supabase: exporta los datos con pg_dump y
-- aplica este schema en el nuevo proveedor.
-- ============================================================

-- =============================================
-- 1. USUARIOS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL DEFAULT 'Marco',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. PERFIL Y METAS
-- =============================================
CREATE TABLE IF NOT EXISTS user_profile (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES users(id) ON DELETE CASCADE,
  peso_objetivo_kg         NUMERIC(5,2) NOT NULL DEFAULT 84.5,
  peso_objetivo_fecha      DATE,
  tdee_referencia_kcal     INTEGER DEFAULT 2240,
  meta_kcal_semana         INTEGER DEFAULT 1875,
  meta_kcal_finde          INTEGER DEFAULT 2250,
  meta_proteina_g          INTEGER DEFAULT 120,
  deficit_objetivo_min     INTEGER DEFAULT 3500,
  deficit_objetivo_max     INTEGER DEFAULT 5000,
  watch_descuento_pct      INTEGER DEFAULT 20,
  updated_at               TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- 3. REGISTROS DE PESO Y MEDIDAS
-- =============================================
CREATE TABLE IF NOT EXISTS weight_records (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha                 DATE NOT NULL,

  -- Báscula normal
  peso_kg               NUMERIC(5,2) NOT NULL,
  cintura_cm            NUMERIC(5,2),
  cadera_cm             NUMERIC(5,2),
  cuello_cm             NUMERIC(5,2),
  bicep_relajado_cm     NUMERIC(5,2),
  bicep_contraido_cm    NUMERIC(5,2),

  -- Báscula inteligente (cuando hay)
  grasa_corporal_pct    NUMERIC(5,2),
  grasa_corporal_kg     NUMERIC(5,2),
  masa_muscular_pct     NUMERIC(5,2),
  masa_osea_kg          NUMERIC(5,2),
  agua_corporal_pct     NUMERIC(5,2),
  grasa_visceral        INTEGER,
  tmb_basicula_kcal     INTEGER,
  bmi                   NUMERIC(5,2),
  edad_metabolica       INTEGER,

  sin_evacuar           BOOLEAN DEFAULT FALSE,
  nota                  TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, fecha)
);

CREATE INDEX IF NOT EXISTS idx_weight_records_user_fecha
  ON weight_records(user_id, fecha DESC);

-- =============================================
-- 4. CATÁLOGO DE ALIMENTOS
-- =============================================
CREATE TABLE IF NOT EXISTS food_catalog (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  porcion_g     NUMERIC(7,2) NOT NULL,
  kcal          NUMERIC(7,2) NOT NULL,
  proteina_g    NUMERIC(7,2) DEFAULT 0,
  carbs_g       NUMERIC(7,2) DEFAULT 0,
  grasa_g       NUMERIC(7,2) DEFAULT 0,
  es_suplemento BOOLEAN DEFAULT FALSE,
  frecuente     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, nombre)
);

CREATE INDEX IF NOT EXISTS idx_food_catalog_user
  ON food_catalog(user_id, frecuente);

-- =============================================
-- 5. COMIDAS DEL DÍA
-- =============================================
CREATE TABLE IF NOT EXISTS meals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha         DATE NOT NULL,
  tipo          TEXT NOT NULL CHECK (tipo IN ('desayuno','comida','cena','snack','suplemento')),
  hora          TIME,
  total_kcal    NUMERIC(7,2) DEFAULT 0,
  total_prot_g  NUMERIC(7,2) DEFAULT 0,
  total_carbs_g NUMERIC(7,2) DEFAULT 0,
  total_grasa_g NUMERIC(7,2) DEFAULT 0,
  notas         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_user_fecha
  ON meals(user_id, fecha DESC);

-- =============================================
-- 6. ITEMS DE CADA COMIDA
-- =============================================
CREATE TABLE IF NOT EXISTS meal_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id         UUID REFERENCES meals(id) ON DELETE CASCADE,
  food_catalog_id UUID REFERENCES food_catalog(id) ON DELETE SET NULL,
  nombre          TEXT NOT NULL,
  cantidad_g      NUMERIC(7,2) NOT NULL,
  kcal            NUMERIC(7,2) NOT NULL,
  proteina_g      NUMERIC(7,2) DEFAULT 0,
  carbs_g         NUMERIC(7,2) DEFAULT 0,
  grasa_g         NUMERIC(7,2) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_items_meal
  ON meal_items(meal_id);

-- =============================================
-- 7. RESUMEN DIARIO
-- =============================================
CREATE TABLE IF NOT EXISTS daily_summary (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha                  DATE NOT NULL,
  dia_semana             TEXT,
  tipo_dia               TEXT CHECK (tipo_dia IN ('semana', 'finde')),
  total_kcal             NUMERIC(7,2) DEFAULT 0,
  total_prot_g           NUMERIC(7,2) DEFAULT 0,
  total_carbs_g          NUMERIC(7,2) DEFAULT 0,
  total_grasa_g          NUMERIC(7,2) DEFAULT 0,
  meta_kcal_dia          INTEGER,
  calorias_watch_raw     INTEGER,
  calorias_watch_adj     INTEGER,
  circulos_cerrados      BOOLEAN DEFAULT FALSE,
  deficit_real_kcal      INTEGER,
  meta_proteina_g        INTEGER DEFAULT 120,
  semana_numero          INTEGER,
  deficit_acumulado_sem  INTEGER,
  dia_cerrado            BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fecha)
);

CREATE INDEX IF NOT EXISTS idx_daily_summary_user_fecha
  ON daily_summary(user_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summary_semana
  ON daily_summary(user_id, semana_numero);

-- =============================================
-- 8. ENTRENOS
-- =============================================
CREATE TABLE IF NOT EXISTS workouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha             DATE NOT NULL,
  tipo              TEXT NOT NULL CHECK (tipo IN ('upper_a','lower_a','upper_b','lower_b','cardio','descanso')),
  duracion_min      INTEGER,
  calorias_watch    INTEGER,
  calorias_reales   INTEGER,
  circulos_cerrados BOOLEAN DEFAULT FALSE,
  kcal_activas_watch INTEGER,
  hombro_estado     TEXT CHECK (hombro_estado IN ('ok','molestia_leve','dolor','parado')),
  hombro_nota       TEXT,
  notas             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fecha, tipo)
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_fecha
  ON workouts(user_id, fecha DESC);

-- =============================================
-- 9. EJERCICIOS DE CADA ENTRENO
-- =============================================
CREATE TABLE IF NOT EXISTS workout_exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id      UUID REFERENCES workouts(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  orden           INTEGER NOT NULL,
  series          INTEGER NOT NULL,
  reps_objetivo   INTEGER,
  reps_logradas   INTEGER,
  peso_kg         NUMERIC(5,2),
  sensacion       TEXT CHECK (sensacion IN ('facil','correcto','dificil','fallo')),
  subir_peso_prox BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout
  ON workout_exercises(workout_id);

-- =============================================
-- 10. SUPLEMENTOS TOMADOS
-- =============================================
CREATE TABLE IF NOT EXISTS supplements_taken (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha           DATE NOT NULL,
  nombre          TEXT NOT NULL,
  cantidad        TEXT,
  hora            TIME,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplements_user_fecha
  ON supplements_taken(user_id, fecha DESC);

-- =============================================
-- 11. MENSAJES DEL CHAT (canal asíncrono)
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id      UUID,  -- FK se agrega después (ver tabla chat_sessions)
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  agent           TEXT CHECK (agent IN ('orquestador','nutriologo','coach','medico','psicologo','sistema')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'done', 'error')),
  reply_to_id     UUID REFERENCES messages(id) ON DELETE SET NULL,
  intent          TEXT,
  processed_at    TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_user_created
  ON messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_pending
  ON messages(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_messages_user_role
  ON messages(user_id, role);

-- =============================================
-- 12. SESIONES DE CHAT (agrupador por día)
-- =============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha       DATE NOT NULL,
  titulo      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fecha)
);

-- Agregar FK de messages → chat_sessions
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS session_id_fk UUID REFERENCES chat_sessions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_messages_session
  ON messages(session_id_fk, created_at);

-- =============================================
-- 13. ALERTAS DEL SISTEMA
-- =============================================
CREATE TABLE IF NOT EXISTS system_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,
  agente      TEXT,
  mensaje     TEXT NOT NULL,
  leida       BOOLEAN DEFAULT FALSE,
  leida_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_unread
  ON system_alerts(user_id, leida, created_at DESC);

-- ============================================================
-- VISTAS
-- ============================================================

-- Resumen semanal calculado
CREATE OR REPLACE VIEW weekly_summary AS
SELECT
  ds.user_id,
  ds.semana_numero,
  MIN(ds.fecha)                   AS semana_inicio,
  MAX(ds.fecha)                   AS semana_fin,
  COUNT(*)                        AS dias_registrados,
  AVG(wr.peso_kg)                 AS peso_promedio,
  SUM(ds.deficit_real_kcal)       AS deficit_total,
  COUNT(w.id)                     AS dias_entrenados,
  AVG(ds.total_prot_g)            AS proteina_promedio
FROM daily_summary ds
LEFT JOIN workouts w     ON w.user_id = ds.user_id AND w.fecha = ds.fecha
LEFT JOIN weight_records wr ON wr.user_id = ds.user_id AND wr.fecha = ds.fecha
GROUP BY ds.user_id, ds.semana_numero;

-- ============================================================
-- ROW LEVEL SECURITY (Supabase)
-- ============================================================
-- Habilitar RLS en todas las tablas con datos de usuario
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile       ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records     ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_catalog       ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summary      ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises  ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements_taken  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts      ENABLE ROW LEVEL SECURITY;

-- Política base: cada usuario solo ve sus propios datos
-- (service_role bypasea RLS — úsalo solo en el script de polling local)
CREATE POLICY "users_own_data"      ON users              FOR ALL USING (auth.uid() = id);
CREATE POLICY "profile_own_data"    ON user_profile       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "weight_own_data"     ON weight_records     FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "food_own_data"       ON food_catalog       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "meals_own_data"      ON meals              FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "workouts_own_data"   ON workouts           FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "messages_own_data"   ON messages           FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "sessions_own_data"   ON chat_sessions      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "alerts_own_data"     ON system_alerts      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "daily_own_data"      ON daily_summary      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "supps_own_data"      ON supplements_taken  FOR ALL USING (auth.uid() = user_id);
