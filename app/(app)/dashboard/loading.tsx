function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800/60 rounded-xl ${className}`} />
}

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      {/* Header skeleton */}
      <div className="pt-2 pb-1 space-y-1">
        <Skeleton className="h-3 w-32 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06] space-y-3">
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
        <div className="rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06] space-y-3">
          <Skeleton className="h-3 w-14 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>

      {/* Calorías */}
      <div className="rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06] space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </div>

      {/* Déficit */}
      <div className="rounded-2xl p-5 bg-zinc-900/80 border border-white/[0.06] space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>

      {/* Entreno + semana */}
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />

      {/* Botón */}
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  )
}
