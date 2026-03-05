import { unstable_cache } from 'next/cache'
import { getLeaderboardEntries } from '../leaderboard-data'
import LeaderboardClient from '../leaderboard-client'

const LEADERBOARD_REVALIDATE_SECONDS = 3600
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Referral Leaderboard — All Time (through February 2026) | GamerPlug',
  description: 'All-time top referrers on GamerPlug. Referrals from the beginning through today.',
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function LeaderboardFebruary2026Page({ params }: PageProps) {
  const { locale: rawLocale } = await params
  const locale = rawLocale === 'es' ? 'es' : 'en'

  const getCachedAllTimeEntries = unstable_cache(
    async () => getLeaderboardEntries(null),
    ['leaderboard-entries-all-time'],
    { revalidate: LEADERBOARD_REVALIDATE_SECONDS }
  )

  try {
    const leaderboard = await getCachedAllTimeEntries()

    return (
      <LeaderboardClient
        entries={leaderboard}
        locale={locale}
        periodLabel="the beginning (through February 2026)"
        nextResetAt={null}
      />
    )
  } catch (error) {
    console.error('Leaderboard february-2026 page failed:', error)
    return (
      <LeaderboardClient
        entries={[]}
        locale={locale}
        periodLabel="the beginning (through February 2026)"
        nextResetAt={null}
      />
    )
  }
}
