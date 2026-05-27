import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HistorialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: registros } = await supabase
    .from('daily_summary').select('*').eq('user_id', user.id)
    .order('fecha', { ascending: false }).limit(30)

  const { data: pesos } = await supabase
    .from('weight_records').select('fecha,peso_kg,cintura_cm').eq('user_id', user.id)
    .order('fecha', { ascending: false }).limit(30)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pesoMap = new Map((pesos ?? []).map((p: any) => [p.fecha, p]))

  return (
    <div>
      {/* Header */}
      <div className="pt-5 pb-10">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.18em] mb-4">
          Registro
        </p>
        <h1 className="text-4xl font-bold text-white tracking-tight leading-none">
          Historial
        </h1>
      </div>

      {!registros?.length ? (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'oklch(0.16 0.009 78)' }}>
          <p className="text-zinc-500 text-sm">Sin registros todavía</p>
          <p className="text-zinc-700 text-xs mt-2">Los días registrados aparecerán aquí</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden divide-y"
             style={{
               backgroundColor: 'oklch(0.16 0.009 78)',
               borderColor: 'oklch(1 0 0 / 0.06)',
               divideColor: 'oklch(1 0 0 / 0.04)',
             }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {registros.map((r: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const peso = pesoMap.get(r.fecha) as any
            const deficit = r.deficit_real_kcal ?? 0
            const deficitColor = deficit >= 700
              ? 'text-emerald-400'
              : deficit >= 100
                ? 'text-amber-400'
                : 'text-zinc-700'

            return (
              <Link
                key={r.fecha}
                href={`/historial/${r.fecha}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors duration-150"
                style={{ '--hover-bg': 'oklch(1 0 0 / 0.03)' } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'oklch(1 0 0 / 0.03)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
              >
                {/* Fecha */}
                <div className="w-11 shrink-0 text-center">
                  <p className="text-[9px] font-semibold text-zinc-600 uppercase tracking-widest mb-0.5">
                    {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short' })}
                  </p>
                  <p
                    className="text-2xl font-bold text-zinc-200 leading-none tabular-nums"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {new Date(r.fecha + 'T00:00:00').getDate()}
                  </p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 capitalize">
                    {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long' })}
                  </p>
                  <p
                    className="text-xs text-zinc-600 tabular-nums mt-0.5"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {Math.round(r.total_kcal)} kcal · {Math.round(r.total_prot_g)}g
                  </p>
                </div>

                {/* Peso */}
                {peso && (
                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-semibold text-zinc-300 tabular-nums"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {peso.peso_kg} kg
                    </p>
                    {peso.cintura_cm && (
                      <p className="text-xs text-zinc-600 tabular-nums">{peso.cintura_cm} cm</p>
                    )}
                  </div>
                )}

                {/* Déficit */}
                <div className="text-right shrink-0 w-12">
                  <p
                    className={cn('text-xs font-bold tabular-nums', deficitColor)}
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {deficit > 0 ? `+${deficit}` : deficit}
                  </p>
                  <p className="text-[9px] text-zinc-700 uppercase tracking-widest">def</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
