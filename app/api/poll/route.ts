import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const { searchParams } = new URL(request.url)
  const since = searchParams.get('since')

  let query = supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id)
    .eq('role', 'assistant')
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(10)

  if (since) query = query.gt('created_at', since)

  const { data } = await query
  return NextResponse.json(data ?? [])
}
