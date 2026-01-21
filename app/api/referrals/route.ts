import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { email, referrer } = body

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!referrer || typeof referrer !== 'string') {
      return NextResponse.json({ error: 'Invalid referrer' }, { status: 400 })
    }

    // Validate that the referrer username belongs to a real user
    const { data: validReferrer } = await supabase
      .from('users')
      .select('gamertag')
      .ilike('gamertag', referrer.trim())
      .single()

    if (!validReferrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    const { error } = await supabase
      .from('referrals')
      .insert([
        {
          referrer: validReferrer.gamertag,
          email: email.toLowerCase().trim(),
          converted: false
        }
      ])

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({
          message: 'Thanks! Redirecting you to download the app...'
        }, { status: 200 })
      }

      console.error('Referral signup error:', error)
      return NextResponse.json({
        error: 'Something went wrong. Please try again.'
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Thanks! Redirecting you to download the app...'
    }, { status: 200 })

  } catch (error) {
    console.error('Referrals API error:', error)
    return NextResponse.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
