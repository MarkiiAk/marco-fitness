import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import ChatClient from '@/components/chat/ChatClient'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Cargar las últimas 4 sesiones
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('id, fecha')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })
    .limit(4)

  if (!sessions?.length) {
    // Sin sesiones — mostrar chat vacío del día
    return (
      <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-48px)]">
        <div className="pt-2 pb-4 border-b border-white/[0.06]">
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Chat</p>
          <h1 className="text-xl font-bold text-zinc-50 tracking-tight leading-none">Hoy</h1>
        </div>
        <ChatClient initialMessages={[]} fecha={new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' })} />
      </div>
    )
  }

  // Cargar mensajes de todas las sesiones (4 días), en orden cronológico
  const sessionIds = sessions.map(s => s.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allMessages: any[] = []

  for (const session of [...sessions].reverse()) { // orden cronológico ascendente
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id_fk', session.id)
      .order('created_at', { ascending: true })

    if (msgs?.length) {
      // Agregar separador de fecha como mensaje especial
      allMessages.push({
        id: `date-${session.fecha}`,
        role: 'date-separator',
        fecha: session.fecha,
        content: formatDate(session.fecha),
      })
      allMessages = allMessages.concat(msgs)
    }
  }

  const latestFecha = sessions[0].fecha

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-48px)]">
      <div className="pt-2 pb-4 border-b border-white/[0.06]">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Chat</p>
        <h1 className="text-xl font-bold text-zinc-50 tracking-tight leading-none">Últimos 4 días</h1>
      </div>
      <ChatClient initialMessages={allMessages} fecha={latestFecha} />
    </div>
  )
}
