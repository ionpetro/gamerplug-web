import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import ReferralForm from './referral-form'
import { User, Game, UserGame } from '@/lib/supabase'

const QUERY_TIMEOUT_MS = 8000
export const revalidate = 300

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

interface UserWithGames extends User {
  user_games: Array<Pick<UserGame, 'id'> & { games: Pick<Game, 'id' | 'name' | 'display_name'> }>;
}

interface PageProps {
  params: Promise<{ username: string }>
}

const getCachedReferralUser = unstable_cache(
  async (username: string) => {
    const supabase = getSupabaseClient()

    const result = await withTimeout(
      supabase
        .from('users')
        .select(`
          id,
          gamertag,
          profile_image_url,
          age,
          platform,
          bio,
          user_games (
            id,
            games (
              id,
              name,
              display_name
            )
          )
        `)
        .ilike('gamertag', username)
        .limit(1)
        .maybeSingle(),
      QUERY_TIMEOUT_MS,
      'Referral query'
    ) as { data: UserWithGames | null; error: { message?: string } | null }

    return result
  },
  ['referral-user'],
  { revalidate: 300 }
)

export default async function ReferralPage({ params }: PageProps) {
  const { username } = await params

  try {
    const { data: user, error } = await getCachedReferralUser(username)

    if (error) {
      console.error('Referral page query failed:', { username, error: error.message })
      notFound()
    }

    if (!user) {
      notFound()
    }

    return <ReferralForm username={username} user={user} />
  } catch (error) {
    console.error('Referral page failed:', { username, error })
    notFound()
  }
}
