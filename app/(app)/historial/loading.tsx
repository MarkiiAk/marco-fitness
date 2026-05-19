function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800/60 rounded-xl ${className}`} />
}

export default function HistorialLoading() {
  return (
    <div className="space-y-5">
      <div className="pt-2 space-y-1">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="rounded-2xl bg-zinc-900/80 border border-white/[0.06] divide-y divide-white/[0.04]">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="w-12 space-y-1">
              <Skeleton className="h-3 w-8 mx-auto rounded-md" />
              <Skeleton className="h-7 w-10 mx-auto rounded-lg" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
