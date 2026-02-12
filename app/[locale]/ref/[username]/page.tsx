import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ReferralForm from './referral-form'
import { User, Game, UserGame } from '@/lib/supabase'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

interface UserWithGames extends User {
  user_games: (UserGame & { games: Game })[];
}

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function ReferralPage({ params }: PageProps) {
  const { username } = await params
  const supabase = getSupabaseClient()

  // Fetch user data with games
  const { data: user } = await supabase
    .from('users')
    .select(`
      *,
      user_games (
        *,
        games (*)
      )
    `)
    .ilike('gamertag', username)
    .single() as { data: UserWithGames | null }

  if (!user) {
    notFound()
  }

  return <ReferralForm username={username} user={user} />
}
