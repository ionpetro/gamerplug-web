'use client'

import { Flame, Trophy, MessageCircle, Volume2, Info, Dices, User } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import DownloadButton from "@/components/DownloadButton"
import { useI18n } from "@/components/I18nProvider"
import { useMemo, useCallback } from "react"

export const Hero = () => {
  const { t, locale } = useI18n()
  
  const hrefWithLocale = useCallback((path: string) => `/${locale}${path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`)}`, [locale])
  
  const titleWords = useMemo(() => t.landing.hero.title2.split(' '), [t.landing.hero.title2])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-accent/20 rounded-full blur-[150px]"></div>

      {/* Abstract Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 blur-[120px] rounded-full"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* QR Code - Bottom Left (Desktop Only) */}
      <div className="hidden md:block absolute bottom-8 left-8 z-20">
        <Link 
          href={hrefWithLocale("/download")}
          className="relative hover:scale-105 transition-transform duration-300 inline-block"
        >
          <Image
            src="/qr.png"
            alt="Download QR Code"
            width={100}
            height={100}
            className="rounded-lg shadow-2xl"
          />
          {/* Handwritten "scan me" text */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="font-handwritten text-2xl text-muted-foreground font-semibold" style={{ 
              transform: 'rotate(-8deg)'
            }}>
              scan me
            </span>
          </div>
        </Link>
      </div>

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center pt-32 md:pt-40 pb-20 md:pb-32 lg:py-0">
        <div className="z-10 min-w-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
            <Flame size={12} />
            {t.landing.hero.badge}
          </div>

          <h1 className="flex flex-col text-7xl sm:text-8xl md:text-6xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight text-white">
            <span style={{ color: '#FF0034' }}>{t.landing.hero.title1}</span>
            {titleWords.map((word: string, index: number) => (
              <span key={index}>{word}</span>
            ))}
          </h1>

          <p className="text-muted-foreground text-lg mb-6 max-w-lg leading-relaxed border-l-2 border-border pl-4 md:pl-6">
            {t.landing.hero.subtitle}
          </p>

          <div className="mb-8 md:mb-10 relative z-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
            <a
              href="https://www.producthunt.com/products/gamerplug?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-gamerplug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                alt="Gamerplug - No more randoms. | Product Hunt"
                width="250"
                height="54"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1056202&theme=dark&t=1767713259591"
                className="h-[48px] sm:h-[54px] w-auto max-w-full"
              />
            </a>
          </div>

          {/* Buttons - Mobile Only */}
          <div className="flex flex-row gap-4 w-full md:hidden">
            <DownloadButton />
          </div>
        </div>

        {/* Phone Graphic */}
        <div className="relative flex justify-center z-10 scale-90 sm:scale-75 lg:scale-90">
          <div className="relative w-[340px] h-[680px] bg-background border-[8px] border-secondary rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-secondary rounded-b-2xl z-20"></div>

            {/* Screen Content */}
            <div className="relative w-full h-full bg-card flex flex-col">
              {/* Gameplay View - Full Height */}
              <div className="relative flex-1 overflow-hidden pb-14">
                {/* Gameplay Video Background */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://d11fcxbq4rxmpu.cloudfront.net/users/3f53dd99-e3d1-4fc9-ba04-a48e5a7115fe/clips/ae1807ff-e6d9-4ea9-b537-943f151620eb/video.mov"
                />

                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1]"></div>

                {/* Speaker Icon - Right Side */}
                <div className="absolute right-2 bottom-28 z-10">
                  <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Volume2 size={14} className="text-white" />
                  </div>
                </div>

                {/* Info Icon - Right Side (below speaker) */}
                <div className="absolute right-2 bottom-28 translate-y-10 z-10">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <Info size={14} className="text-black" />
                  </div>
                </div>

                {/* Player Info Overlay - Bottom Left (above nav bar) */}
                <div className="absolute bottom-20 left-2 z-10 flex items-center gap-2">
                  {/* Profile Picture */}
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/50">
                    <Image
                      src="https://defdpaewkfkpvdzyhvsr.supabase.co/storage/v1/object/public/profile-images/3f53dd99-e3d1-4fc9-ba04-a48e5a7115fe/profile-1760629423680.jpg"
                      alt="Player"
                      width={36}
                      height={36}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Username */}
                  <div className="flex flex-col">
                    <span className="text-white text-base leading-tight font-space-mono">@iiribit</span>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-sm border-t border-white/10 z-30 flex items-center justify-around px-4">
                {/* Dices Icon - Left (Active) */}
                <div className="flex flex-col items-center gap-1">
                  <Dices size={22} className="text-primary" />
                </div>
                {/* Message Icon - Center */}
                <div className="flex flex-col items-center gap-1">
                  <MessageCircle size={22} className="text-white/60" />
                </div>
                {/* Person Icon - Right */}
                <div className="flex flex-col items-center gap-1">
                  <User size={22} className="text-white/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements around Phone */}
          <div className="absolute top-32 -right-8 bg-card/95 backdrop-blur p-4 rounded-xl border border-border flex items-center gap-3 shadow-2xl z-20 max-w-[200px]">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
              <Trophy size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold">{t.landing.phone.rankMatch}</div>
              <div className="text-sm font-bold text-foreground">{t.landing.phone.topPlayer}</div>
            </div>
          </div>

          <div className="absolute bottom-40 -left-12 bg-card/95 backdrop-blur p-4 rounded-xl border border-border flex items-center gap-3 shadow-2xl z-20">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
              <MessageCircle size={20} className="text-accent" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold">{t.landing.phone.newMessage}</div>
              <div className="text-sm font-bold text-foreground">{t.landing.phone.duoMessage}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
