import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { Referral, User } from '@/lib/supabase'
import LeaderboardClient from './leaderboard-client'

const QUERY_TIMEOUT_MS = 8000
const LEADERBOARD_REVALIDATE_SECONDS = 3600
export const dynamic = 'force-dynamic'

async function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ])
}

export const metadata = {
  title: 'Referral Leaderboard | GamerPlug',
  description: 'See who\'s referring the most gamers to GamerPlug. Top referrers ranked by converted referrals.',
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export interface LeaderboardEntry {
  rank: number
  gamertag: string
  profileImageUrl: string | null
  totalReferrals: number
  convertedReferrals: number
  conversionRate: number
}

const USER_BATCH_SIZE = 500
const LEADERBOARD_RESET_DAY = 5

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

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function getLeaderboardEntries(periodStartIso: string): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseClient()

  const { data: referrals, error: referralsError } = await withTimeout(
    supabase
      .from('referrals')
      .select('referrer, converted, created_at')
      .gte('created_at', periodStartIso),
    QUERY_TIMEOUT_MS,
    'Leaderboard referrals query'
  ) as { data: (Pick<Referral, 'referrer' | 'converted'> & { created_at: string })[] | null; error: { message?: string } | null }

  if (referralsError) {
    throw new Error(referralsError.message || 'Failed to load referrals')
  }

  const referrerMap = new Map<string, { total: number; converted: number }>()
  for (const ref of referrals ?? []) {
    const entry = referrerMap.get(ref.referrer) ?? { total: 0, converted: 0 }
    entry.total++
    if (ref.converted) entry.converted++
    referrerMap.set(ref.referrer, entry)
  }

  const gamertags = Array.from(referrerMap.keys())
  const usersMap = new Map<string, Pick<User, 'gamertag' | 'profile_image_url'>>()

  if (gamertags.length > 0) {
    const userQueries = chunk(gamertags, USER_BATCH_SIZE).map((batch, index) =>
      withTimeout(
        supabase
          .from('users')
          .select('gamertag, profile_image_url')
          .in('gamertag', batch),
        QUERY_TIMEOUT_MS,
        `Leaderboard users query batch ${index + 1}`
      ) as Promise<{ data: Pick<User, 'gamertag' | 'profile_image_url'>[] | null; error: { message?: string } | null }>
    )

    const userResults = await Promise.all(userQueries)
    for (const result of userResults) {
      if (result.error) {
        throw new Error(result.error.message || 'Failed to load leaderboard users')
      }
      for (const user of result.data ?? []) {
        usersMap.set(user.gamertag.toLowerCase(), user)
      }
    }
  }

  return gamertags
    .map((gamertag) => {
      const stats = referrerMap.get(gamertag)!
      const user = usersMap.get(gamertag.toLowerCase())
      return {
        rank: 0,
        gamertag: user?.gamertag ?? gamertag,
        profileImageUrl: user?.profile_image_url ?? null,
        totalReferrals: stats.total,
        convertedReferrals: stats.converted,
        conversionRate: stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0,
      }
    })
    .filter((entry) => entry.convertedReferrals > 0)
    .sort((a, b) => b.convertedReferrals - a.convertedReferrals || b.totalReferrals - a.totalReferrals)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))
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
    const clientEntries = leaderboard.map(({ rank, gamertag, profileImageUrl, convertedReferrals }) => ({
      rank,
      gamertag,
      profileImageUrl,
      convertedReferrals,
    }))

    return (
      <LeaderboardClient
        entries={clientEntries}
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
