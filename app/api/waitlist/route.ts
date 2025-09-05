import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  return '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, honeypot } = body

    // Check honeypot field (should be empty)
    if (honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Get client IP
    const clientIP = getClientIP(request)

    // Check rate limiting
    const { data: rateLimitCheck } = await supabase.rpc('check_ip_rate_limit', {
      client_ip: clientIP
    })

    if (!rateLimitCheck) {
      return NextResponse.json({ 
        error: 'Too many requests. Please try again later.' 
      }, { status: 429 })
    }

    // Try to insert email
    const { error } = await supabase
      .from('waitlist')
      .insert([
        { 
          email: email.toLowerCase().trim(),
          ip_address: clientIP
        }
      ])

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json({ 
          message: 'Thanks for your interest! We\'ll be in touch soon.' 
        }, { status: 200 })
      }
      
      console.error('Waitlist signup error:', error)
      return NextResponse.json({ 
        error: 'Something went wrong. Please try again.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Successfully joined the waitlist! We\'ll be in touch soon.' 
    }, { status: 200 })

  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json({ 
      error: 'Something went wrong. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}