'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ManualFoodEntry({ tipo }: { tipo: string }) {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!nombre.trim()) return
    setLoading(true)

    const content = `Registra en mi ${tipo} de hoy: ${nombre.trim()}${cantidad ? ` (${cantidad}g)` : ''}. Busca los macros y agrégalo.`

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    setLoading(false)
    router.push('/chat')
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-600">
        Escribe el nombre y yo busco los macros — llega en ~5 min al chat.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: huevito Kinder, taco de canasta..."
          className="flex-1 px-3 py-2 bg-zinc-800 border border-white/[0.06] rounded-xl text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500/50"
        />
        <input
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          placeholder="g"
          className="w-16 px-2 py-2 bg-zinc-800 border border-white/[0.06] rounded-xl text-zinc-200 placeholder-zinc-600 text-sm text-center focus:outline-none focus:border-emerald-500/50"
        />
      </div>
      <button
        type="button"
        onClick={handleSend}
        disabled={!nombre.trim() || loading}
        className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 border border-white/[0.06] rounded-xl text-sm text-zinc-300 font-medium transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle size={14} />
        {loading ? 'Enviando...' : 'Mandar al chat para registrar'}
      </button>
    </div>
  )
}
