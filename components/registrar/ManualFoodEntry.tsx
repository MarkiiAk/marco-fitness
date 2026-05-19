'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface ItemAgregado {
  id: string
  nombre: string
  porcion_g: number
  kcal: number
  proteina_g: number
  carbs_g: number
  grasa_g: number
  cantidad_g: number
  kcal_calc: number
  proteina_calc: number
}

export default function ManualFoodEntry({ onAdd }: { onAdd: (item: ItemAgregado) => void }) {
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [kcal, setKcal] = useState('')
  const [prot, setProt] = useState('')

  function handleAdd() {
    if (!nombre || !cantidad || !kcal) return

    const item: ItemAgregado = {
      id: 'manual-' + Date.now(),
      nombre,
      porcion_g: parseFloat(cantidad),
      kcal: parseFloat(kcal),
      proteina_g: parseFloat(prot || '0'),
      carbs_g: 0,
      grasa_g: 0,
      cantidad_g: parseFloat(cantidad),
      kcal_calc: parseFloat(kcal),
      proteina_calc: parseFloat(prot || '0'),
    }

    onAdd(item)
    setNombre('')
    setCantidad('')
    setKcal('')
    setProt('')
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre del alimento"
        className="w-full px-3 py-2 bg-zinc-800 border border-white/[0.06] rounded-xl text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500/50"
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-zinc-600 mb-1 block">Gramos</label>
          <input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            placeholder="100"
            className="w-full px-2 py-1.5 bg-zinc-800 border border-white/[0.06] rounded-lg text-zinc-200 text-sm text-center focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-600 mb-1 block">kcal</label>
          <input
            type="number"
            value={kcal}
            onChange={e => setKcal(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1.5 bg-zinc-800 border border-white/[0.06] rounded-lg text-zinc-200 text-sm text-center focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-600 mb-1 block">Proteína (g)</label>
          <input
            type="number"
            value={prot}
            onChange={e => setProt(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1.5 bg-zinc-800 border border-white/[0.06] rounded-lg text-zinc-200 text-sm text-center focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!nombre || !cantidad || !kcal}
        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 border border-white/[0.06] rounded-xl text-sm text-zinc-300 font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Agregar alimento
      </button>
    </div>
  )
}
