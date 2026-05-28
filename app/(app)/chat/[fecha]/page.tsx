import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { todayISO, formatDate } from '@/lib/utils'
import ChatClient from '@/components/chat/ChatClient'

export const dynamic = 'force-dynamic'

export default async function ChatFechaPage({ params }: { params: Promise<{ fecha: string }> }) {
  const { fecha } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Cargar mensajes del día
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', user.id)
    .eq('fecha', fecha)
    .maybeSingle()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let messages: any[] = []
  if (session) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id_fk', session.id)
      .order('created_at', { ascending: true })
    messages = data ?? []
  }

  const isToday = fecha === todayISO()

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-48px)]">
      {/* Header */}
      <div className="pt-2 pb-4 border-b border-white/[0.06]">
        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.1em] mb-1">Chat</p>
        <h1 className="text-xl font-bold text-zinc-50 tracking-tight leading-none capitalize">
          {isToday ? 'Hoy' : formatDate(fecha)}
        </h1>
      </div>

      <ChatClient initialMessages={messages} fecha={fecha} />
    </div>
  )
}
