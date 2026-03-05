import { createClient } from '@supabase/supabase-js'
import { Referral, User } from '@/lib/supabase'

const QUERY_TIMEOUT_MS = 8000
const USER_BATCH_SIZE = 500

export interface LeaderboardEntry {
  rank: number
  gamertag: string
  profileImageUrl: string | null
  totalReferrals: number
  convertedReferrals: number
  conversionRate: number
}

async function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ])
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

/**
 * Fetch leaderboard entries. When periodStartIso is null, returns all-time (from the beginning).
 */
export async function getLeaderboardEntries(
  periodStartIso: string | null
): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseClient()

  let query = supabase
    .from('referrals')
    .select('referrer, converted, created_at')

  if (periodStartIso) {
    query = query.gte('created_at', periodStartIso)
  }

  const { data: referrals, error: referralsError } = await withTimeout(
    query,
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
