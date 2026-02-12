import { createClient } from '@supabase/supabase-js'
import { Referral, User } from '@/lib/supabase'
import LeaderboardClient from './leaderboard-client'

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

export default async function LeaderboardPage() {
  const supabase = getSupabaseClient()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('*') as { data: Referral[] | null }

  // Aggregate referrals by referrer
  const referrerMap = new Map<string, { total: number; converted: number }>()
  for (const ref of referrals ?? []) {
    const entry = referrerMap.get(ref.referrer) ?? { total: 0, converted: 0 }
    entry.total++
    if (ref.converted) entry.converted++
    referrerMap.set(ref.referrer, entry)
  }

  // Fetch user profiles for all referrers
  const gamertags = Array.from(referrerMap.keys())
  let usersMap = new Map<string, Pick<User, 'gamertag' | 'profile_image_url'>>()

  if (gamertags.length > 0) {
    const { data: users } = await supabase
      .from('users')
      .select('gamertag, profile_image_url')
      .in('gamertag', gamertags)

    for (const user of users ?? []) {
      usersMap.set(user.gamertag.toLowerCase(), user)
    }
  }

  // Build leaderboard sorted by converted desc, then total desc
  const leaderboard: LeaderboardEntry[] = gamertags
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
    .sort((a, b) => b.convertedReferrals - a.convertedReferrals || b.totalReferrals - a.totalReferrals)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  return <LeaderboardClient entries={leaderboard} />
}
