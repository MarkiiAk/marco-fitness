import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { todayISO } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })

  const today = todayISO()

  // Crear o recuperar sesión del día
  const { data: session } = await supabase
    .from('chat_sessions')
    .upsert(
      { user_id: user.id, fecha: today, titulo: `Sesión ${today}` },
      { onConflict: 'user_id,fecha' }
    )
    .select()
    .single()

  // Insertar mensaje del usuario
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      user_id: user.id,
      session_id_fk: session?.id ?? null,
      role: 'user',
      content: content.trim(),
      status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(message)
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const fecha = searchParams.get('fecha') ?? todayISO()

  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', user.id)
    .eq('fecha', fecha)
    .maybeSingle()

  if (!session) return NextResponse.json([])

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id_fk', session.id)
    .order('created_at', { ascending: true })

  return NextResponse.json(messages ?? [])
}
