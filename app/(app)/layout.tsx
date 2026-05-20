import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/shared/BottomNav'
import Sidebar from '@/components/shared/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Último peso registrado para la barra de progreso del sidebar
  let pesoActual: number = 92.1
  if (user) {
    const { data } = await supabase
      .from('weight_records')
      .select('peso_kg')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data?.peso_kg) pesoActual = parseFloat(String(data.peso_kg))
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-800">
        <Sidebar pesoActual={pesoActual} />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 md:pl-60 pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom nav — solo mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <BottomNav />
      </div>
    </div>
  )
}
