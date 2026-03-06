'use client'

import { Trophy, Crown, Medal, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, startTransition } from 'react'

export interface LeaderboardEntry {
  rank: number
  gamertag: string
  profileImageUrl: string | null
  convertedReferrals: number
}

function useCountdown(nextResetAtIso: string) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = new Date(nextResetAtIso).getTime()

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      const next = {
        days: Math.floor(diff / (24 * 60 * 60 * 1000)),
        hours: Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
        minutes: Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)),
        seconds: Math.floor((diff % (60 * 1000)) / 1000),
      }
      startTransition(() => setLeft(next))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextResetAtIso])

  return { ...left, mounted }
}

const TROPHY_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'] as const
const RANK_LABELS = ['1st', '2nd', '3rd'] as const
const RANK_GLOWS = [
  'shadow-[0_0_40px_rgba(255,215,0,0.15)]',
  'shadow-[0_0_30px_rgba(192,192,192,0.1)]',
  'shadow-[0_0_30px_rgba(205,127,50,0.1)]',
] as const

function Avatar({ src, gamertag, size = 48, ring }: { src: string | null; gamertag: string; size?: number; ring?: string }) {
  const ringClass = ring ?? 'ring-white/10'
  return src ? (
    <Image
      src={src}
      alt={gamertag}
      width={size}
      height={size}
      className={`rounded-full object-cover ring-2 ${ringClass}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold ring-2 ${ringClass}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {gamertag.charAt(0).toUpperCase()}
    </div>
  )
}

function PodiumCard({ entry, highlight, locale }: { entry: LeaderboardEntry; highlight: boolean; locale: string }) {
  const trophyColor = TROPHY_COLORS[entry.rank - 1]
  const glow = RANK_GLOWS[entry.rank - 1]
  const RankIcon = entry.rank === 1 ? Crown : Medal

  const orderClass = highlight ? 'sm:order-2' : entry.rank === 2 ? 'sm:order-1' : 'sm:order-3'

  return (
    <Link href={`/${locale}/profile/${entry.gamertag}`} className={orderClass}>
    <div
      className={`relative flex flex-col items-center gap-4 rounded-2xl border bg-gradient-to-b p-8 transition-all duration-300 sm:hover:scale-[1.03] cursor-pointer h-full ${glow} ${
        highlight
          ? 'border-[#FFD700]/20 from-[#FFD700]/[0.06] to-transparent sm:-mt-6'
          : entry.rank === 2
          ? 'border-[#C0C0C0]/15 from-[#C0C0C0]/[0.04] to-transparent'
          : 'border-[#CD7F32]/15 from-[#CD7F32]/[0.04] to-transparent'
      }`}
    >
      {/* Rank badge */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ backgroundColor: `${trophyColor}15` }}
      >
        <RankIcon size={highlight ? 24 : 20} color={trophyColor} />
      </div>

      {/* Avatar with colored ring */}
      <div className="relative">
        <Avatar
          src={entry.profileImageUrl}
          gamertag={entry.gamertag}
          size={highlight ? 80 : 64}
          ring={`ring-[${trophyColor}]/30`}
        />
        {highlight && (
          <div className="absolute -inset-2 hidden sm:block rounded-full border border-[#FFD700]/20 sm:animate-pulse" />
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: trophyColor }}>
          {RANK_LABELS[entry.rank - 1]} Place
        </span>
        <h3 className={`font-bold text-white mt-1 ${highlight ? 'text-xl' : 'text-lg'}`}>
          {entry.gamertag}
        </h3>
      </div>

      {/* Referral count */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
        <Trophy size={14} color={trophyColor} />
        <span className="text-sm">
          <span className="font-bold text-white">{entry.convertedReferrals}</span>
          <span className="text-white/50 ml-1">referrals</span>
        </span>
      </div>
    </div>
    </Link>
  )
}

export default function LeaderboardClient({
  entries,
  locale,
  periodLabel,
  nextResetAt = null,
}: {
  entries: LeaderboardEntry[]
  locale: 'en' | 'es'
  periodLabel: string
  nextResetAt?: string | null
}) {
  const top3 = entries.slice(0, 3)
  const countdown = useCountdown(nextResetAt || '2099-01-01T00:00:00.000Z')

  return (
    <div className="min-h-screen bg-background text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-15%] left-[-15%] w-[320px] h-[320px] bg-primary/12 blur-[110px] rounded-full sm:top-[-20%] sm:w-[520px] sm:h-[520px] sm:bg-primary/20 sm:blur-[190px]" />
        <div className="hidden sm:block absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
      </div>
      <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(to_right,oklch(0.2_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.2_0_0)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 -z-10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute hidden sm:inline-flex h-full w-full sm:animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-medium text-primary">
              Referrals since {periodLabel}
            </span>
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl tracking-tight">
            Top Referrers
          </h1>
          <p className="mt-4 text-white/50 text-lg max-w-md mx-auto">
            The gamers bringing the most players to GamerPlug
            {' · '}
            <Link
              href={`/${locale}/leaderboard/february-2026`}
              className="text-primary hover:underline font-medium"
            >
              Previous month
            </Link>
          </p>

          {/* Countdown to next reset (5th of next month) — only when nextResetAt is set */}
          {nextResetAt && (
            <div className="mt-4 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-1.5 text-white/60">
                <Clock size={14} />
                <span className="text-xs font-medium">Resets in</span>
              </div>
              {countdown.mounted ? (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-center min-w-[2rem]">
                    <span className="text-base sm:text-lg font-bold tabular-nums text-white">
                      {String(countdown.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">days</span>
                  </div>
                  <div className="flex flex-col items-center min-w-[2rem]">
                    <span className="text-base sm:text-lg font-bold tabular-nums text-white">
                      {String(countdown.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">hrs</span>
                  </div>
                  <div className="flex flex-col items-center min-w-[2rem]">
                    <span className="text-base sm:text-lg font-bold tabular-nums text-white">
                      {String(countdown.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">min</span>
                  </div>
                  <div className="flex flex-col items-center min-w-[2rem]">
                    <span className="text-base sm:text-lg font-bold tabular-nums text-white">
                      {String(countdown.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">sec</span>
                  </div>
                </div>
              ) : (
                <div className="h-6 w-32 rounded bg-white/10 animate-pulse" />
              )}
            </div>
          )}
        </div>

        {/* Podium */}
        {top3.length > 0 ? (
          <div className={`mb-20 gap-4 sm:items-end ${top3.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 sm:grid-cols-3'}`}>
            {top3.map((entry, i) => (
              <PodiumCard
                key={entry.gamertag}
                entry={entry}
                highlight={entry.rank === 1}
                locale={locale}
              />
            ))}
          </div>
        ) : null}

        {/* Table */}
        {entries.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white/70">All Referrers</h2>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] sm:bg-white/[0.02] sm:backdrop-blur-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                    <th className="px-6 py-4 font-medium w-16">Rank</th>
                    <th className="px-6 py-4 font-medium">Referrer</th>
                    <th className="px-6 py-4 font-medium text-right">Referrals</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.gamertag}
                      className="border-b border-white/5 transition-colors sm:hover:bg-white/[0.04] group [content-visibility:auto] [contain-intrinsic-size:0_60px]"
                    >
                      <td className="px-6 py-4">
                        {entry.rank <= 3 ? (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${TROPHY_COLORS[entry.rank - 1]}15` }}
                          >
                            <Trophy size={16} color={TROPHY_COLORS[entry.rank - 1]} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <span className="text-sm text-white/40 font-medium">{entry.rank}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/${locale}/profile/${entry.gamertag}`} className="flex items-center gap-3">
                          <Avatar src={entry.profileImageUrl} gamertag={entry.gamertag} size={36} />
                          <span className="font-semibold sm:group-hover:text-primary transition-colors">
                            {entry.gamertag}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-sm font-semibold">
                          {entry.convertedReferrals}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center">
            <Trophy size={40} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/40 text-lg">No referrals yet.</p>
            <p className="text-white/30 text-sm mt-1">Be the first to refer a gamer!</p>
          </div>
        )}
      </div>
    </div>
  )
}
