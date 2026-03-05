import { unstable_cache } from 'next/cache'
import { getLeaderboardEntries, type LeaderboardEntry } from './leaderboard-data'
import LeaderboardClient from './leaderboard-client'

const LEADERBOARD_REVALIDATE_SECONDS = 3600
const LEADERBOARD_RESET_DAY = 5
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Referral Leaderboard | GamerPlug',
  description: 'See who\'s referring the most gamers to GamerPlug. Top referrers ranked by converted referrals.',
}

export type { LeaderboardEntry } from './leaderboard-data'

/** Current period starts on the 5th; if today is before the 5th, use previous month's 5th. All UTC. */
function getPeriodStart(): { iso: string; label: string } {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const day = now.getUTCDate()
  const periodDate = day >= LEADERBOARD_RESET_DAY
    ? new Date(Date.UTC(year, month, LEADERBOARD_RESET_DAY))
    : new Date(Date.UTC(year, month - 1, LEADERBOARD_RESET_DAY))
  const label = periodDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return { iso: periodDate.toISOString(), label }
}

/** Next reset is the 5th of next month (or this month if we're before the 5th). UTC. */
function getNextResetAt(): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const day = now.getUTCDate()
  const nextReset = day >= LEADERBOARD_RESET_DAY
    ? new Date(Date.UTC(year, month + 1, LEADERBOARD_RESET_DAY))
    : new Date(Date.UTC(year, month, LEADERBOARD_RESET_DAY))
  return nextReset.toISOString()
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function LeaderboardPage({ params }: PageProps) {
  const { locale: rawLocale } = await params
  const locale = rawLocale === 'es' ? 'es' : 'en'

  const { iso: periodStartIso, label: periodLabel } = getPeriodStart()
  const nextResetAt = getNextResetAt()

  const getCachedLeaderboardEntries = unstable_cache(
    async () => getLeaderboardEntries(periodStartIso),
    ['leaderboard-entries-v2', periodStartIso],
    { revalidate: LEADERBOARD_REVALIDATE_SECONDS }
  )

  try {
    const leaderboard = await getCachedLeaderboardEntries()

    return (
      <LeaderboardClient
        entries={leaderboard}
        locale={locale}
        periodLabel={periodLabel}
        nextResetAt={nextResetAt}
      />
    )
  } catch (error) {
    console.error('Leaderboard page failed:', error)
    return (
      <LeaderboardClient
        entries={[]}
        locale={locale}
        periodLabel={periodLabel}
        nextResetAt={nextResetAt}
      />
    )
  }
}
