'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, Plus, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type TipoComida = 'desayuno' | 'comida' | 'cena' | 'snack' | 'suplemento'

interface FoodItem {
  id: string
  nombre: string
  porcion_g: number
  kcal: number
  proteina_g: number
  carbs_g: number
  grasa_g: number
}

interface ItemAgregado extends FoodItem {
  cantidad_g: number
  kcal_calc: number
  proteina_calc: number
}

const TIPOS: { value: TipoComida; label: string }[] = [
  { value: 'desayuno',    label: 'Desayuno' },
  { value: 'comida',      label: 'Comida' },
  { value: 'cena',        label: 'Cena' },
  { value: 'snack',       label: 'Snack' },
  { value: 'suplemento',  label: 'Suplemento' },
]

function calcMacros(food: FoodItem, cantidadG: number) {
  const r = cantidadG / food.porcion_g
  return {
    kcal:     +(food.kcal      * r).toFixed(1),
    proteina: +(food.proteina_g * r).toFixed(1),
    carbs:    +(food.carbs_g   * r).toFixed(1),
    grasa:    +(food.grasa_g   * r).toFixed(1),
  }
}

export default function RegistrarComidaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tipo, setTipo] = useState<TipoComida>('comida')
  const [catalog, setCatalog] = useState<FoodItem[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [items, setItems] = useState<ItemAgregado[]>([])
  const [cantidadTemp, setCantidadTemp] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [notas, setNotas] = useState('')

  // Hora actual como tipo_dia
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 11)       setTipo('desayuno')
    else if (hour < 16)  setTipo('comida')
    else if (hour < 20)  setTipo('cena')
    else                 setTipo('cena')
  }, [])

  // Cargar catálogo
  useEffect(() => {
    async function loadCatalog() {
      const { data } = await supabase.from('food_catalog').select('*').eq('frecuente', true).limit(30)
      setCatalog((data ?? []) as FoodItem[])
      setResults((data ?? []) as FoodItem[])
    }
    loadCatalog()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Búsqueda en tiempo real
  useEffect(() => {
    if (!query.trim()) {
      setResults(catalog)
      return
    }
    const q = query.toLowerCase()
    setResults(catalog.filter(f => f.nombre.toLowerCase().includes(q)))
  }, [query, catalog])

  function agregarItem(food: FoodItem) {
    const cant = parseFloat(cantidadTemp[food.id] || String(food.porcion_g))
    const macros = calcMacros(food, cant)
    setItems(prev => [...prev, {
      ...food,
      cantidad_g: cant,
      kcal_calc: macros.kcal,
      proteina_calc: macros.proteina,
    }])
    setCantidadTemp(prev => ({ ...prev, [food.id]: '' }))
    setQuery('')
  }

  function quitarItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  const totales = items.reduce(
    (acc, item) => ({
      kcal: +(acc.kcal + item.kcal_calc).toFixed(1),
      prot: +(acc.prot + item.proteina_calc).toFixed(1),
    }),
    { kcal: 0, prot: 0 }
  )

  async function handleSubmit() {
    if (!items.length) return
    setLoading(true)

    await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo,
        notas: notas || null,
        items: items.map(item => ({
          food_catalog_id: item.id,
          nombre: item.nombre,
          cantidad_g: item.cantidad_g,
          kcal: item.kcal_calc,
          proteina_g: item.proteina_calc,
          carbs_g: 0,
          grasa_g: 0,
        })),
      }),
    })

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Registro</p>
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight leading-none">Comida</h1>
      </div>

      {/* Selector de tipo */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TIPOS.map(t => (
          <button
            key={t.value}
            onClick={() => setTipo(t.value)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all',
              tipo === t.value
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900/80 border-white/[0.06] text-zinc-500 hover:text-zinc-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar alimento..."
            className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={14} className="text-zinc-500" />
            </button>
          )}
        </div>

        {/* Resultados */}
        <div className="max-h-52 overflow-y-auto divide-y divide-white/[0.04]">
          {results.slice(0, 8).map(food => (
            <div key={food.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{food.nombre}</p>
                <p className="text-[11px] text-zinc-600">
                  {food.kcal} kcal · {food.proteina_g}g prot · por {food.porcion_g}g
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  value={cantidadTemp[food.id] ?? ''}
                  onChange={e => setCantidadTemp(prev => ({ ...prev, [food.id]: e.target.value }))}
                  placeholder={String(food.porcion_g)}
                  className="w-14 px-2 py-1 bg-zinc-800 border border-white/[0.06] rounded-lg text-xs text-zinc-200 text-center focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-zinc-600">g</span>
                <button
                  onClick={() => agregarItem(food)}
                  className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                >
                  <Plus size={14} className="text-emerald-400" />
                </button>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <p className="px-4 py-4 text-sm text-zinc-600">Sin resultados para "{query}"</p>
          )}
        </div>
      </div>

      {/* Items agregados */}
      {items.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-200">Agregados</p>
            <p className="text-sm font-semibold text-emerald-400 tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {totales.kcal} kcal
            </p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{item.nombre}</p>
                  <p className="text-[11px] text-zinc-600 tabular-nums">
                    {item.cantidad_g}g · {item.kcal_calc} kcal · {item.proteina_calc}g prot
                  </p>
                </div>
                <button onClick={() => quitarItem(i)} className="text-zinc-700 hover:text-rose-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-white/[0.06] flex justify-between text-xs text-zinc-500">
            <span>{items.length} {items.length === 1 ? 'alimento' : 'alimentos'}</span>
            <span className="tabular-nums" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {totales.prot}g proteína
            </span>
          </div>
        </div>
      )}

      {/* Notas */}
      <textarea
        value={notas}
        onChange={e => setNotas(e.target.value)}
        placeholder="Nota opcional..."
        rows={2}
        className="w-full px-4 py-3 bg-zinc-900/80 border border-white/[0.06] rounded-2xl text-zinc-200 placeholder-zinc-600 text-sm resize-none focus:outline-none focus:border-emerald-500/50"
      />

      {/* Guardar */}
      <button
        onClick={handleSubmit}
        disabled={loading || !items.length}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40
                   text-white font-semibold text-base tracking-wide rounded-2xl
                   transition-all duration-200
                   shadow-[0_0_20px_rgba(16,185,129,0.3)]
                   hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]
                   active:scale-[0.98]"
      >
        {loading ? 'Guardando...' : `Guardar ${tipo}`}
      </button>
    </div>
  )
}
