export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-background text-white relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.2_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.2_0_0)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 -z-10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
        <div className="mb-16 text-center">
          <div className="mx-auto h-8 w-36 rounded-full bg-white/10 animate-pulse" />
          <div className="mx-auto mt-6 h-12 w-64 rounded-lg bg-white/10 animate-pulse" />
          <div className="mx-auto mt-4 h-6 w-80 max-w-full rounded-lg bg-white/10 animate-pulse" />
        </div>

        <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-white/10 bg-white/[0.03] p-8 animate-pulse ${i === 1 ? 'sm:-mt-6' : ''}`}
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-white/10" />
              <div className="mx-auto mt-5 h-16 w-16 rounded-full bg-white/10" />
              <div className="mx-auto mt-5 h-4 w-20 rounded bg-white/10" />
              <div className="mx-auto mt-3 h-6 w-28 rounded bg-white/10" />
              <div className="mx-auto mt-5 h-9 w-28 rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[56px_1fr_120px] items-center gap-3 rounded-xl px-2 py-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 animate-pulse" />
                <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
                <div className="justify-self-end h-7 w-16 rounded-full bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
