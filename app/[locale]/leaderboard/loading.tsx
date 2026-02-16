import { Loader2 } from 'lucide-react'

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-white/60">Loading leaderboard...</p>
      </div>
    </div>
  )
}
