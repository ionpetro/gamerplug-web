type GamesPageSkeletonProps = {
  count?: number
  className?: string
}

export function GamesPageSkeleton({ count = 8, className = "" }: GamesPageSkeletonProps) {
  const gameSkeletons = Array.from({ length: count })

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {gameSkeletons.map((_, idx) => (
        <div
          key={`game-skeleton-${idx}`}
          className="rounded-2xl border border-border/50 bg-card overflow-hidden"
        >
          <div className="relative aspect-[3/4] bg-white/5 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-6 w-3/4 rounded-full bg-white/10 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-white/5 animate-pulse" />
              <div className="h-4 w-5/6 rounded-full bg-white/5 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-primary/15 animate-pulse" />
              <div className="h-6 w-12 rounded-full bg-primary/15 animate-pulse" />
            </div>
            <div className="h-4 w-1/2 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
