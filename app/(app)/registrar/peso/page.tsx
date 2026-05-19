'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

function localToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
}

export default function RegistrarPesoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fecha, setFecha] = useState(localToday())
  const [showMedidas, setShowMedidas] = useState(false)
  const [showBascula, setShowBascula] = useState(false)
  const [form, setForm] = useState({
    peso_kg: '',
    cintura_cm: '',
    cadera_cm: '',
    cuello_cm: '',
    bicep_relajado_cm: '',
    bicep_contraido_cm: '',
    grasa_corporal_pct: '',
    grasa_corporal_kg: '',
    masa_muscular_pct: '',
    grasa_visceral: '',
    tmb_basicula_kcal: '',
    bmi: '',
    edad_metabolica: '',
    sin_evacuar: false,
    nota: '',
  })

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.peso_kg) return
    setLoading(true)

    const payload = {
      fecha,
      peso_kg: parseFloat(form.peso_kg),
      cintura_cm: form.cintura_cm ? parseFloat(form.cintura_cm) : null,
      cadera_cm: form.cadera_cm ? parseFloat(form.cadera_cm) : null,
      cuello_cm: form.cuello_cm ? parseFloat(form.cuello_cm) : null,
      bicep_relajado_cm: form.bicep_relajado_cm ? parseFloat(form.bicep_relajado_cm) : null,
      bicep_contraido_cm: form.bicep_contraido_cm ? parseFloat(form.bicep_contraido_cm) : null,
      grasa_corporal_pct: form.grasa_corporal_pct ? parseFloat(form.grasa_corporal_pct) : null,
      grasa_corporal_kg: form.grasa_corporal_kg ? parseFloat(form.grasa_corporal_kg) : null,
      masa_muscular_pct: form.masa_muscular_pct ? parseFloat(form.masa_muscular_pct) : null,
      grasa_visceral: form.grasa_visceral ? parseInt(form.grasa_visceral) : null,
      tmb_basicula_kcal: form.tmb_basicula_kcal ? parseInt(form.tmb_basicula_kcal) : null,
      bmi: form.bmi ? parseFloat(form.bmi) : null,
      edad_metabolica: form.edad_metabolica ? parseInt(form.edad_metabolica) : null,
      sin_evacuar: form.sin_evacuar,
      nota: form.nota || null,
    }

    const res = await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (res.ok) router.push('/dashboard')
  }

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Registro</p>
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight leading-none">Peso</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de fecha */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-zinc-900/80 border border-white/[0.06]">
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em] mb-2">
            Fecha del registro
          </label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            max={localToday()}
            className="w-full bg-transparent text-zinc-200 text-sm focus:outline-none"
          />
        </div>

        {/* Peso principal */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Peso <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" step="0.1" min="50" max="200"
              value={form.peso_kg}
              onChange={e => set('peso_kg', e.target.value)}
              required
              placeholder="92.1"
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-2xl font-bold text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-zinc-400 font-medium">kg</span>
          </div>
        </div>

        {/* Cintura siempre visible */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Cintura</label>
          <div className="flex items-center gap-2">
            <input
              type="number" step="0.5" min="50" max="200"
              value={form.cintura_cm}
              onChange={e => set('cintura_cm', e.target.value)}
              placeholder="103.5"
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-zinc-400 font-medium">cm</span>
          </div>
        </div>

        {/* Más medidas (toggle) */}
        <button
          type="button"
          onClick={() => setShowMedidas(!showMedidas)}
          className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span>+ Otras medidas (cadera, cuello, bíceps)</span>
          <ChevronDown size={16} className={`transition-transform ${showMedidas ? 'rotate-180' : ''}`} />
        </button>

        {showMedidas && (
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
            {[
              { field: 'cadera_cm', label: 'Cadera', placeholder: '102.0' },
              { field: 'cuello_cm', label: 'Cuello', placeholder: '46.5' },
              { field: 'bicep_relajado_cm', label: 'Bíceps relajado', placeholder: '35.0' },
              { field: 'bicep_contraido_cm', label: 'Bíceps contraído', placeholder: '37.0' },
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="flex items-center gap-3">
                <label className="w-36 text-sm text-zinc-400 shrink-0">{label}</label>
                <input
                  type="number" step="0.5"
                  value={form[field as keyof typeof form] as string}
                  onChange={e => set(field, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
                <span className="text-zinc-500 text-sm">cm</span>
              </div>
            ))}
          </div>
        )}

        {/* Báscula inteligente (toggle) */}
        <button
          type="button"
          onClick={() => setShowBascula(!showBascula)}
          className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span>+ Datos de báscula inteligente</span>
          <ChevronDown size={16} className={`transition-transform ${showBascula ? 'rotate-180' : ''}`} />
        </button>

        {showBascula && (
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
            {[
              { field: 'grasa_corporal_pct', label: 'Grasa corporal', unit: '%', placeholder: '26.2' },
              { field: 'grasa_corporal_kg', label: 'Grasa en kg', unit: 'kg', placeholder: '24.1' },
              { field: 'masa_muscular_pct', label: 'Masa muscular', unit: '%', placeholder: '38.8' },
              { field: 'grasa_visceral', label: 'Grasa visceral', unit: 'nivel', placeholder: '14' },
              { field: 'tmb_basicula_kcal', label: 'TMB', unit: 'kcal', placeholder: '1947' },
              { field: 'bmi', label: 'BMI', unit: '', placeholder: '31.9' },
              { field: 'edad_metabolica', label: 'Edad metabólica', unit: 'años', placeholder: '46' },
            ].map(({ field, label, unit, placeholder }) => (
              <div key={field} className="flex items-center gap-3">
                <label className="w-36 text-sm text-zinc-400 shrink-0">{label}</label>
                <input
                  type="number" step="0.1"
                  value={form[field as keyof typeof form] as string}
                  onChange={e => set(field, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
                {unit && <span className="text-zinc-500 text-sm w-8">{unit}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Sin evacuar */}
        <label className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={form.sin_evacuar}
            onChange={e => set('sin_evacuar', e.target.checked)}
            className="w-4 h-4 accent-emerald-500"
          />
          <span className="text-sm text-zinc-400">Sin evacuar esta mañana</span>
        </label>

        {/* Nota */}
        <textarea
          value={form.nota}
          onChange={e => set('nota', e.target.value)}
          placeholder="Nota opcional..."
          rows={2}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm resize-none"
        />

        <button
          type="submit"
          disabled={loading || !form.peso_kg}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar peso'}
        </button>
      </form>
    </div>
  )
}
