'use client'

import { AlertCircle } from 'lucide-react'

export default function LeaderboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-card/70 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-3">Couldn&apos;t load leaderboard</h1>
        <p className="text-white/60 mb-6">
          {error?.message || 'Something went wrong while loading this page.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
