'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserCircle, ExternalLink } from 'lucide-react'
import { User, Game, UserGame } from '@/lib/supabase'
import { getGameAssetUrl, getPlatformAssetUrl } from '@/lib/assets'
import { Footer } from '@/components/Footer'

function useLocale() {
  const pathname = usePathname()
  const seg = pathname?.split('/')[1]
  return seg === 'es' ? 'es' : 'en'
}

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

interface UserWithGames extends User {
  user_games: (UserGame & { games: Game })[];
}

interface ReferralFormProps {
  username: string
  user: UserWithGames
}

export default function ReferralForm({ username, user }: ReferralFormProps) {
  const locale = useLocale()
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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Background red gradients (matches leaderboard) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.2_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.2_0_0)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-xs font-medium text-primary"
              >
                You&apos;ve been invited!
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic leading-none tracking-tight">
                <span className="text-foreground">Join </span>
                <span className="font-extrabold italic tracking-tight text-foreground">GAMER</span>
                <span className="font-extrabold italic tracking-tight text-primary">PLUG</span>
                <br />
                <span className="text-foreground">with </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{username}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Find your perfect gaming teammates and build lasting communities. Join thousands of gamers already on the platform.
              </p>
            </div>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 min-h-12 py-3 px-5 md:h-10 md:py-0 md:px-6 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="h-10 px-6 font-bold rounded-lg hover:opacity-90 transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </Button>
              </div>

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
            </motion.form>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 pt-4"
            >
              <div>
                <p className="text-2xl font-bold text-foreground">300+</p>
                <p className="text-sm text-muted-foreground">Gamers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">10+</p>
                <p className="text-sm text-muted-foreground">Games</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Free</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Profile Card */}
            <div className="relative bg-card rounded-2xl p-6 sm:p-8 w-full max-w-[340px] sm:max-w-[380px] border border-border shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
              {/* Floating Stats Card - dark theme */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -left-4 sm:-left-8 top-1/4 bg-card rounded-xl p-3 sm:p-4 shadow-sm border border-border z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <UserCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{user.user_games?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Games</p>
                  </div>
                </div>
              </motion.div>

              {/* Profile Image */}
              <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-lg opacity-50" />
                {user.profile_image_url ? (
                  <Image
                    src={user.profile_image_url}
                    alt={user.gamertag}
                    fill
                    className="rounded-full object-cover border-4 border-card relative z-10"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center border-4 border-card relative z-10 text-primary">
                    <UserCircle className="size-16" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">@{user.gamertag}</h2>

                {user.age && (
                  <p className="text-sm text-muted-foreground">Age: {user.age}</p>
                )}

                {/* Platforms */}
                {user.platform && Array.isArray(user.platform) && user.platform.length > 0 && (
                  <div className="flex gap-2 justify-center flex-wrap">
                    {user.platform.map((platform) => {
                      const platformIconUrl = getPlatformAssetUrl(platform);
                      return (
                        <div
                          key={platform}
                          className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-foreground bg-secondary rounded-md"
                        >
                          {platformIconUrl && (
                            <Image
                              src={platformIconUrl}
                              alt={platform}
                              width={14}
                              height={14}
                              className="w-3.5 h-3.5 object-contain rounded"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )}
                          <span>{platform}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {user.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Games */}
              {user.user_games && user.user_games.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 text-center">Plays</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {user.user_games.slice(0, 5).map((userGame) => {
                      const imageUrl = getGameAssetUrl(userGame.games.display_name);
                      return (
                        <div key={userGame.id} className="relative group">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-border transition-all duration-300 hover:scale-105">
                            <Image
                              src={imageUrl}
                              alt={userGame.games.display_name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {user.user_games.length > 5 && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary flex items-center justify-center text-xs text-muted-foreground font-medium">
                        +{user.user_games.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View Profile Button */}
              <Link
                href={`/${locale}/profile/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 h-10 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium text-foreground transition-all duration-300 group border border-border cursor-pointer"
              >
                <span>View Profile</span>
                <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground text-center mt-8"
        >
          By continuing, you agree to our{' '}
          <Link href={`/${locale}/tac`} className="text-primary hover:underline transition-colors cursor-pointer">Terms</Link>
          {' '}and{' '}
          <Link href={`/${locale}/privacy`} className="text-primary hover:underline transition-colors cursor-pointer">Privacy Policy</Link>
        </motion.p>
      </div>
      <Footer />
    </div>
  )
}