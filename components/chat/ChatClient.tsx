'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const AGENT_LABELS: Record<string, { label: string; color: string }> = {
  nutriologo:   { label: 'Nutriólogo',   color: 'text-emerald-400' },
  coach:        { label: 'Coach',         color: 'text-sky-400' },
  medico:       { label: 'Médico',        color: 'text-rose-400' },
  psicologo:    { label: 'Psicólogo',     color: 'text-amber-400' },
  orquestador:  { label: 'Sistema',       color: 'text-zinc-400' },
  sistema:      { label: 'Sistema',       color: 'text-zinc-400' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ChatClient({ initialMessages, fecha }: { initialMessages: any[]; fecha: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastPollRef = useRef(new Date().toISOString())

  // Scroll al fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Polling cada 30s si hay mensajes pendientes
  useEffect(() => {
    const hasPending = messages.some(m => m.role === 'user' && m.status === 'pending')
    if (!hasPending) return

    const interval = setInterval(async () => {
      const res = await fetch(`/api/poll?since=${lastPollRef.current}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newMsgs: any[] = await res.json()
      if (newMsgs.length > 0) {
        setMessages(prev => [...prev, ...newMsgs])
        lastPollRef.current = new Date().toISOString()
      }
    }, 30_000)

    return () => clearInterval(interval)
  }, [messages])

  async function handleSend() {
    if (!input.trim() || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)

    // Optimistic: mostrar mensaje del usuario inmediatamente
    const tempMsg = { id: 'temp-' + Date.now(), role: 'user', content, status: 'pending', created_at: new Date().toISOString() }
    setMessages(prev => [...prev, tempMsg])

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (res.ok) {
      const saved = await res.json()
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? saved : m))
    }

    setSending(false)
  }

  return (
    <>
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-zinc-400 text-sm">Sin mensajes hoy</p>
            <p className="text-zinc-500 text-xs mt-1">Escribe lo que comiste o pregunta algo</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={msg.id ?? i}>
            {/* Separador de fecha */}
            {msg.role === 'date-separator' ? (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider capitalize">
                  {msg.content}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
            ) : (
              <>
                <div className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[85%]', msg.role === 'user' ? 'items-end' : 'items-start')}>
                    {msg.role === 'assistant' && msg.agent && (
                      <p className={cn('text-[10px] font-semibold mb-1 px-1', AGENT_LABELS[msg.agent]?.color ?? 'text-zinc-400')}>
                        {AGENT_LABELS[msg.agent]?.label ?? msg.agent}
                      </p>
                    )}
                    <div className={cn(
                      'px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-zinc-100 rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                        : 'bg-zinc-900/80 border border-white/[0.06] text-zinc-200 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                    )}>
                      {msg.role === 'assistant' && (msg.status === 'pending' || msg.status === 'processing') ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-1">
                            {[0, 1, 2].map(j => (
                              <div key={j} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"
                                   style={{ animationDelay: `${j * 150}ms` }} />
                            ))}
                          </div>
                          <span className="text-zinc-400 text-xs">Procesando ~5 min</span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
                {msg.role === 'user' && (msg.status === 'pending' || msg.status === 'processing') && (
                  <div className="flex justify-start mt-2">
                    <div className="px-4 py-3 text-sm bg-zinc-900/80 border border-white/[0.06] rounded-t-2xl rounded-br-2xl rounded-bl-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(j => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"
                                 style={{ animationDelay: `${j * 150}ms` }} />
                          ))}
                        </div>
                        <span className="text-zinc-400 text-xs">Procesando ~5 min</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] pt-4">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Escribe lo que comiste, pregunta algo..."
            rows={1}
            className="flex-1 px-4 py-3 bg-zinc-900/80 border border-white/[0.06] rounded-2xl text-zinc-200
                       placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-emerald-500/50
                       max-h-32 overflow-y-auto"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40
                       flex items-center justify-center transition-all duration-200
                       shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95 shrink-0"
          >
            <Send size={16} className="text-white" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 text-center">
          Las respuestas llegan en ~5 min · Enter para enviar
        </p>
      </div>
    </>
  )
}
