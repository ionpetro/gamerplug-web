import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ReferralForm from './referral-form'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function ReferralPage({ params }: PageProps) {
  const { username } = await params
  const supabase = getSupabaseClient()

  // Validate that this username belongs to a real user
  const { data: user } = await supabase
    .from('users')
    .select('gamertag')
    .ilike('gamertag', username)
    .single()

  if (!user) {
    notFound()
  }

  return <ReferralForm username={username} />
}
