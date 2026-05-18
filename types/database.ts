// Tipos de la base de datos
// Generados manualmente basados en el schema de 001_initial_schema.sql
// Para regenerar automáticamente: npx supabase gen types typescript --project-id irkarqmneazcevfqdvxg

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
      user_profile: {
        Row: {
          id: string
          user_id: string
          peso_objetivo_kg: number
          peso_objetivo_fecha: string | null
          tdee_referencia_kcal: number
          meta_kcal_semana: number
          meta_kcal_finde: number
          meta_proteina_g: number
          deficit_objetivo_min: number
          deficit_objetivo_max: number
          watch_descuento_pct: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          peso_objetivo_kg?: number
          peso_objetivo_fecha?: string | null
          tdee_referencia_kcal?: number
          meta_kcal_semana?: number
          meta_kcal_finde?: number
          meta_proteina_g?: number
          deficit_objetivo_min?: number
          deficit_objetivo_max?: number
          watch_descuento_pct?: number
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_profile']['Insert']>
      }
      weight_records: {
        Row: {
          id: string
          user_id: string
          fecha: string
          peso_kg: number
          cintura_cm: number | null
          cadera_cm: number | null
          cuello_cm: number | null
          bicep_relajado_cm: number | null
          bicep_contraido_cm: number | null
          grasa_corporal_pct: number | null
          grasa_corporal_kg: number | null
          masa_muscular_pct: number | null
          masa_osea_kg: number | null
          agua_corporal_pct: number | null
          grasa_visceral: number | null
          tmb_basicula_kcal: number | null
          bmi: number | null
          edad_metabolica: number | null
          sin_evacuar: boolean
          nota: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fecha: string
          peso_kg: number
          cintura_cm?: number | null
          cadera_cm?: number | null
          cuello_cm?: number | null
          bicep_relajado_cm?: number | null
          bicep_contraido_cm?: number | null
          grasa_corporal_pct?: number | null
          grasa_corporal_kg?: number | null
          masa_muscular_pct?: number | null
          masa_osea_kg?: number | null
          agua_corporal_pct?: number | null
          grasa_visceral?: number | null
          tmb_basicula_kcal?: number | null
          bmi?: number | null
          edad_metabolica?: number | null
          sin_evacuar?: boolean
          nota?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['weight_records']['Insert']>
      }
      food_catalog: {
        Row: {
          id: string
          user_id: string
          nombre: string
          porcion_g: number
          kcal: number
          proteina_g: number
          carbs_g: number
          grasa_g: number
          es_suplemento: boolean
          frecuente: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nombre: string
          porcion_g: number
          kcal: number
          proteina_g?: number
          carbs_g?: number
          grasa_g?: number
          es_suplemento?: boolean
          frecuente?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['food_catalog']['Insert']>
      }
      meals: {
        Row: {
          id: string
          user_id: string
          fecha: string
          tipo: 'desayuno' | 'comida' | 'cena' | 'snack' | 'suplemento'
          hora: string | null
          total_kcal: number
          total_prot_g: number
          total_carbs_g: number
          total_grasa_g: number
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fecha: string
          tipo: 'desayuno' | 'comida' | 'cena' | 'snack' | 'suplemento'
          hora?: string | null
          total_kcal?: number
          total_prot_g?: number
          total_carbs_g?: number
          total_grasa_g?: number
          notas?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['meals']['Insert']>
      }
      meal_items: {
        Row: {
          id: string
          meal_id: string
          food_catalog_id: string | null
          nombre: string
          cantidad_g: number
          kcal: number
          proteina_g: number
          carbs_g: number
          grasa_g: number
          created_at: string
        }
        Insert: {
          id?: string
          meal_id: string
          food_catalog_id?: string | null
          nombre: string
          cantidad_g: number
          kcal: number
          proteina_g?: number
          carbs_g?: number
          grasa_g?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['meal_items']['Insert']>
      }
      daily_summary: {
        Row: {
          id: string
          user_id: string
          fecha: string
          dia_semana: string | null
          tipo_dia: 'semana' | 'finde' | null
          total_kcal: number
          total_prot_g: number
          total_carbs_g: number
          total_grasa_g: number
          meta_kcal_dia: number | null
          calorias_watch_raw: number | null
          calorias_watch_adj: number | null
          circulos_cerrados: boolean
          deficit_real_kcal: number | null
          meta_proteina_g: number
          semana_numero: number | null
          deficit_acumulado_sem: number | null
          dia_cerrado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fecha: string
          dia_semana?: string | null
          tipo_dia?: 'semana' | 'finde' | null
          total_kcal?: number
          total_prot_g?: number
          total_carbs_g?: number
          total_grasa_g?: number
          meta_kcal_dia?: number | null
          calorias_watch_raw?: number | null
          calorias_watch_adj?: number | null
          circulos_cerrados?: boolean
          deficit_real_kcal?: number | null
          meta_proteina_g?: number
          semana_numero?: number | null
          deficit_acumulado_sem?: number | null
          dia_cerrado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['daily_summary']['Insert']>
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          fecha: string
          tipo: 'upper_a' | 'lower_a' | 'upper_b' | 'lower_b' | 'cardio' | 'descanso'
          duracion_min: number | null
          calorias_watch: number | null
          calorias_reales: number | null
          circulos_cerrados: boolean
          kcal_activas_watch: number | null
          hombro_estado: 'ok' | 'molestia_leve' | 'dolor' | 'parado' | null
          hombro_nota: string | null
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fecha: string
          tipo: 'upper_a' | 'lower_a' | 'upper_b' | 'lower_b' | 'cardio' | 'descanso'
          duracion_min?: number | null
          calorias_watch?: number | null
          calorias_reales?: number | null
          circulos_cerrados?: boolean
          kcal_activas_watch?: number | null
          hombro_estado?: 'ok' | 'molestia_leve' | 'dolor' | 'parado' | null
          hombro_nota?: string | null
          notas?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['workouts']['Insert']>
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          nombre: string
          orden: number
          series: number
          reps_objetivo: number | null
          reps_logradas: number | null
          peso_kg: number | null
          sensacion: 'facil' | 'correcto' | 'dificil' | 'fallo' | null
          subir_peso_prox: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          nombre: string
          orden: number
          series: number
          reps_objetivo?: number | null
          reps_logradas?: number | null
          peso_kg?: number | null
          sensacion?: 'facil' | 'correcto' | 'dificil' | 'fallo' | null
          subir_peso_prox?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['workout_exercises']['Insert']>
      }
      messages: {
        Row: {
          id: string
          user_id: string
          session_id_fk: string | null
          role: 'user' | 'assistant'
          content: string
          agent: 'orquestador' | 'nutriologo' | 'coach' | 'medico' | 'psicologo' | 'sistema' | null
          status: 'pending' | 'processing' | 'done' | 'error'
          reply_to_id: string | null
          intent: string | null
          processed_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id_fk?: string | null
          role: 'user' | 'assistant'
          content: string
          agent?: 'orquestador' | 'nutriologo' | 'coach' | 'medico' | 'psicologo' | 'sistema' | null
          status?: 'pending' | 'processing' | 'done' | 'error'
          reply_to_id?: string | null
          intent?: string | null
          processed_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          fecha: string
          titulo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fecha: string
          titulo?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
      system_alerts: {
        Row: {
          id: string
          user_id: string
          tipo: string
          agente: string | null
          mensaje: string
          leida: boolean
          leida_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tipo: string
          agente?: string | null
          mensaje: string
          leida?: boolean
          leida_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['system_alerts']['Insert']>
      }
      supplements_taken: {
        Row: {
          id: string
          user_id: string
          fecha: string
          nombre: string
          cantidad: string | null
          hora: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fecha: string
          nombre: string
          cantidad?: string | null
          hora?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['supplements_taken']['Insert']>
      }
    }
    Views: {
      weekly_summary: {
        Row: {
          user_id: string
          semana_numero: number | null
          semana_inicio: string | null
          semana_fin: string | null
          dias_registrados: number | null
          peso_promedio: number | null
          deficit_total: number | null
          dias_entrenados: number | null
          proteina_promedio: number | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
