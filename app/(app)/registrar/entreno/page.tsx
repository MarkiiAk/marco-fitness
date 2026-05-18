'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RUTINAS = {
  upper_a: {
    label: 'Upper A — Lunes',
    ejercicios: [
      'Press de pecho (máquina)',
      'Remo sentado (máquina)',
      'Jalón al pecho (máquina)',
      'Press hombros (máquina)',
      'Curl bíceps (máquina)',
      'Extensión tríceps (máquina)',
    ],
  },
  lower_a: {
    label: 'Lower A — Martes',
    ejercicios: [
      'Prensa de piernas',
      'Curl femoral (máquina)',
      'Extensión cuádriceps (máquina)',
      'Abductor (máquina)',
      'Crunch abdominal (máquina)',
      'Elevaciones de pierna (banco)',
    ],
  },
  upper_b: {
    label: 'Upper B — Jueves',
    ejercicios: [
      'Press inclinado mancuernas',
      'Remo 1 brazo mancuerna',
      'Jalón agarre estrecho (máquina)',
      'Elevaciones laterales mancuernas',
      'Curl martillo mancuernas',
      'Extensión tríceps sobre cabeza',
    ],
  },
  lower_b: {
    label: 'Lower B — Viernes',
    ejercicios: [
      'Peso muerto rumano (mancuernas)',
      'Prensa piernas posición alta',
      'Curl femoral (máquina)',
      'Hip thrust mancuerna en banco',
      'Crunch abdominal (máquina)',
      'Elevaciones de pierna (banco)',
    ],
  },
}

type TipoRutina = keyof typeof RUTINAS

interface EjercicioState {
  nombre: string
  series: number
  reps: number
  peso_kg: string
  sensacion: 'facil' | 'correcto' | 'dificil' | 'fallo' | ''
}

export default function RegistrarEntrenoPage() {
  const router = useRouter()
  const [tipo, setTipo] = useState<TipoRutina | ''>('')
  const [ejercicios, setEjercicios] = useState<EjercicioState[]>([])
  const [caloriasWatch, setCaloriasWatch] = useState('')
  const [circulosCerrados, setCirculosCerrados] = useState(false)
  const [hombro, setHombro] = useState<'ok' | 'molestia_leve' | 'dolor' | 'parado'>('ok')
  const [duracion, setDuracion] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)

  function selectTipo(t: TipoRutina) {
    setTipo(t)
    setEjercicios(
      RUTINAS[t].ejercicios.map(nombre => ({
        nombre,
        series: 4,
        reps: 10,
        peso_kg: '',
        sensacion: '',
      }))
    )
  }

  function updateEjercicio(i: number, field: keyof EjercicioState, value: string | number) {
    setEjercicios(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tipo) return
    setLoading(true)

    const payload = {
      tipo,
      duracion_min: duracion ? parseInt(duracion) : null,
      calorias_watch: caloriasWatch ? parseInt(caloriasWatch) : null,
      calorias_reales: caloriasWatch ? Math.round(parseInt(caloriasWatch) * 0.8) : null,
      circulos_cerrados: circulosCerrados,
      kcal_activas_watch: caloriasWatch ? parseInt(caloriasWatch) : null,
      hombro_estado: hombro,
      notas: notas || null,
      ejercicios: ejercicios.map((e, i) => ({
        nombre: e.nombre,
        orden: i + 1,
        series: e.series,
        reps_objetivo: e.reps,
        peso_kg: e.peso_kg ? parseFloat(e.peso_kg) : null,
        sensacion: e.sensacion || null,
      })),
    }

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (res.ok) router.push('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Registrar entreno</h1>
        <p className="text-sm text-zinc-500 mt-1">Cierre de sesión</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de rutina */}
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(RUTINAS) as TipoRutina[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => selectTipo(t)}
              className={`px-3 py-3 rounded-xl text-sm font-medium border transition-colors text-left ${
                tipo === t
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {RUTINAS[t].label}
            </button>
          ))}
        </div>

        {/* Ejercicios */}
        {ejercicios.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300">Ejercicios</h2>
            {ejercicios.map((ej, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
                <p className="text-sm font-medium text-zinc-200">
                  {ej.nombre}
                  {ej.nombre.includes('hombros') || ej.nombre.includes('laterales') ? ' ⚠️' : ''}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Series</label>
                    <input
                      type="number" min="1" max="10"
                      value={ej.series}
                      onChange={e => updateEjercicio(i, 'series', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Reps</label>
                    <input
                      type="number" min="1" max="30"
                      value={ej.reps}
                      onChange={e => updateEjercicio(i, 'reps', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Peso (kg)</label>
                    <input
                      type="number" step="2.5" min="0"
                      value={ej.peso_kg}
                      onChange={e => updateEjercicio(i, 'peso_kg', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                {/* Sensación */}
                <div className="flex gap-2">
                  {(['facil', 'correcto', 'dificil', 'fallo'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateEjercicio(i, 'sensacion', s)}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        ej.sensacion === s
                          ? s === 'facil' ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                            : s === 'correcto' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : s === 'dificil' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {s === 'facil' ? 'Fácil' : s === 'correcto' ? 'OK' : s === 'dificil' ? 'Difícil' : 'Fallo'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Apple Watch */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300">Apple Watch</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-400 shrink-0">Calorías activas</label>
            <input
              type="number"
              value={caloriasWatch}
              onChange={e => setCaloriasWatch(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="text-zinc-500 text-sm">kcal</span>
          </div>
          {caloriasWatch && (
            <p className="text-xs text-zinc-500">
              Real (-20%): <span className="text-emerald-400">{Math.round(parseInt(caloriasWatch) * 0.8)} kcal</span>
            </p>
          )}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={circulosCerrados}
              onChange={e => setCirculosCerrados(e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-sm text-zinc-400">Círculos cerrados</span>
          </label>
        </div>

        {/* Duración y hombro */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <label className="block text-sm text-zinc-400 mb-2">Duración</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duracion}
                onChange={e => setDuracion(e.target.value)}
                placeholder="90"
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-zinc-500 text-sm">min</span>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <label className="block text-sm text-zinc-400 mb-2">Hombro izq.</label>
            <select
              value={hombro}
              onChange={e => setHombro(e.target.value as typeof hombro)}
              className="w-full px-2 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="ok">OK</option>
              <option value="molestia_leve">Molestia</option>
              <option value="dolor">Dolor</option>
              <option value="parado">Paré</option>
            </select>
          </div>
        </div>

        {/* Notas */}
        <textarea
          value={notas}
          onChange={e => setNotas(e.target.value)}
          placeholder="Notas del entreno..."
          rows={2}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-50 placeholder-zinc-600 text-sm resize-none focus:outline-none focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={loading || !tipo}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? 'Guardando...' : 'Cerrar día'}
        </button>
      </form>
    </div>
  )
}
