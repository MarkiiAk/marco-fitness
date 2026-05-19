export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-emerald-500 animate-spin" />
        <p className="text-xs text-zinc-600">Cargando...</p>
      </div>
    </div>
  )
}
