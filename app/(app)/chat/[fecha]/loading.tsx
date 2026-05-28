function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800/60 rounded-xl ${className}`} />
}

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-48px)]">
      <div className="pt-2 pb-4 border-b border-white/[0.06] space-y-1">
        <Skeleton className="h-3 w-10 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <div className="flex-1 py-4 space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-16 w-56 rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40 rounded-2xl" />
        </div>
      </div>
      <div className="border-t border-white/[0.06] pt-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}
