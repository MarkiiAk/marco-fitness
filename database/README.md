# Base de datos — Marco Fitness

## Estructura

```
database/
├── migrations/
│   ├── 001_initial_schema.sql   — Todas las tablas, índices, RLS
│   ├── 002_seed_food_catalog.sql — Catálogo inicial de alimentos
│   └── 003_seed_initial_data.sql — Datos iniciales de Marco
└── README.md
```

## Portabilidad

El schema es PostgreSQL estándar. Para migrar de Supabase a otro proveedor:

```bash
# Exportar datos de Supabase
pg_dump --data-only --no-owner -h db.[project].supabase.co -U postgres -d postgres > backup.sql

# Aplicar schema en el nuevo proveedor
psql -h [nuevo-host] -U postgres -d [nueva-db] < database/migrations/001_initial_schema.sql
psql -h [nuevo-host] -U postgres -d [nueva-db] < backup.sql
```

## Aplicar migraciones en Supabase

1. Ir a **SQL Editor** en el dashboard de Supabase
2. Ejecutar `001_initial_schema.sql` completo
3. Obtener el UUID del usuario Marco (después del primer login)
4. Reemplazar `:user_id` en `002_seed_food_catalog.sql` y ejecutar
5. Reemplazar `:user_id` en `003_seed_initial_data.sql` y ejecutar

## Tablas principales

| Tabla | Descripción |
|---|---|
| `users` | Usuario único (Marco) |
| `user_profile` | Metas, TDEE, configuración |
| `weight_records` | Peso diario + medidas + báscula inteligente |
| `food_catalog` | Catálogo de alimentos con macros |
| `meals` | Agrupador de comidas por día y tipo |
| `meal_items` | Items individuales de cada comida |
| `daily_summary` | Resumen y totales del día |
| `workouts` | Sesiones de gym |
| `workout_exercises` | Ejercicios dentro de cada sesión |
| `supplements_taken` | Suplementos por día |
| `messages` | Canal de chat asíncrono (se limpia semanalmente) |
| `chat_sessions` | Agrupador de mensajes por día |
| `system_alerts` | Alertas generadas por los agentes |

## Política de limpieza de mensajes

La tabla `messages` es el canal de comunicación asíncrona entre la web app y Claude Code local.
Los mensajes se limpian cada domingo después de la revisión semanal:

```sql
DELETE FROM messages
WHERE created_at < NOW() - INTERVAL '7 days'
  AND status = 'done';
```

La memoria real del sistema vive en los archivos locales de Claude Code
(`CLAUDE.md`, `memory/`, `data/`), no en Supabase.
