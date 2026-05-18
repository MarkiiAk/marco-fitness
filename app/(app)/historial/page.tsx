import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDateShort } from '@/lib/utils'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HistorialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: registros } = await supabase
    .from('daily_summary')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })
    .limit(30)

  const { data: pesos } = await supabase
    .from('weight_records')
    .select('fecha,peso_kg,cintura_cm')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })
    .limit(30)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pesoMap = new Map((pesos ?? []).map((p: any) => [p.fecha, p]))

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Registro</p>
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight leading-none">Historial</h1>
      </div>

      {!registros?.length ? (
        <div className="relative overflow-hidden rounded-2xl p-8 bg-zinc-900/80 border border-white/[0.06] text-center">
          <p className="text-zinc-600 text-sm">Sin registros todavía</p>
          <p className="text-zinc-700 text-xs mt-1">Los días registrados aparecerán aquí</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06] divide-y divide-white/[0.04]">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {registros.map((r: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const peso = pesoMap.get(r.fecha) as any
            const deficit = r.deficit_real_kcal ?? 0
            const deficitColor = deficit >= 700 ? 'text-emerald-400' : deficit >= 100 ? 'text-amber-400' : 'text-zinc-600'

            return (
              <Link
                key={r.fecha}
                href={`/historial/${r.fecha}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Fecha */}
                <div className="w-12 shrink-0 text-center">
                  <p className="text-xs font-semibold text-zinc-500 uppercase">
                    {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short' })}
                  </p>
                  <p className="text-2xl font-bold text-zinc-200 leading-none" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {new Date(r.fecha + 'T00:00:00').getDate()}
                  </p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 capitalize">
                    {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long' })}
                  </p>
                  <p className="text-xs text-zinc-600 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {Math.round(r.total_kcal)} kcal · {Math.round(r.total_prot_g)}g prot
                  </p>
                </div>

                {/* Peso */}
                {peso && (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-zinc-300 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {peso.peso_kg} kg
                    </p>
                    {peso.cintura_cm && (
                      <p className="text-xs text-zinc-600 tabular-nums">{peso.cintura_cm} cm</p>
                    )}
                  </div>
                )}

                {/* Déficit */}
                <div className="text-right shrink-0 w-16">
                  <p className={cn('text-xs font-semibold tabular-nums', deficitColor)}
                     style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {deficit > 0 ? `+${deficit}` : deficit}
                  </p>
                  <p className="text-[10px] text-zinc-700">déficit</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
