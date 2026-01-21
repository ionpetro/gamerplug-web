'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const IOS_APP_URL = 'https://apps.apple.com/us/app/gamerplug/id6752116866'
const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.ionpetro.gamerplug&pcampaignid=web_share'

function detectDevice(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const ua = navigator.userAgent.toLowerCase()

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios'
  }
  if (/android/.test(ua)) {
    return 'android'
  }
  return 'desktop'
}

function getAppStoreUrl(): string {
  const device = detectDevice()
  if (device === 'ios') return IOS_APP_URL
  if (device === 'android') return ANDROID_APP_URL
  return IOS_APP_URL
}

interface ReferralFormProps {
  username: string
}

export default function ReferralForm({ username }: ReferralFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer: username })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      window.location.href = getAppStoreUrl()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Invitation message */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium"
          >
            You&apos;ve been invited!
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-black">
            <span className="text-primary">{username}</span> invited you to join GamerPlug
          </h1>

          <p className="text-muted-foreground text-lg">
            Find your perfect gaming teammates and build lasting communities.
          </p>
        </div>

        {/* Email form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-4 bg-card border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-accent text-white font-semibold py-4 h-14 text-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Get the App'}
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground pt-4"
        >
          By continuing, you agree to our{' '}
          <a href="/tac" className="text-primary hover:underline">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        </motion.p>
      </motion.div>
    </div>
  )
}
