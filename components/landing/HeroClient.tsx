'use client'

import { Flame, Trophy, MessageCircle } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import DownloadButton from "@/components/DownloadButton"
import { useI18n } from "@/components/I18nProvider"

export const Hero = () => {
  const { t, locale } = useI18n()
  
  const hrefWithLocale = (path: string) => `/${locale}${path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`)}`

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
      <Link 
        href={hrefWithLocale("/download")}
        className="hidden md:block absolute bottom-8 left-8 z-20 hover:scale-105 transition-transform duration-300"
      >
        <Image
          src="/qr.png"
          alt="Download QR Code"
          width={100}
          height={100}
          className="rounded-lg shadow-2xl"
        />
      </Link>

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center pt-32 md:pt-40 pb-20 md:pb-32 lg:py-0">
        <div className="z-10 min-w-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
            <Flame size={12} />
            {t.landing.hero.badge}
          </div>

          <h1 className="flex flex-col text-6xl sm:text-7xl md:text-6xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
            <span style={{ color: '#FF0034' }}>{t.landing.hero.title1}</span>
            {t.landing.hero.title2.split(' ').map((word: string, index: number) => (
              <span key={index}>{word}</span>
            ))}
          </h1>

          <p className="text-muted-foreground text-lg mb-8 md:mb-10 max-w-lg leading-relaxed border-l-2 border-border pl-4 md:pl-6">
            {t.landing.hero.subtitle}
          </p>

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
              {/* Profile Card */}
              <div className="flex-1 relative overflow-hidden">
                {/* Card Stack Effect */}
                <div className="absolute top-6 inset-x-8 h-full bg-secondary/20 rounded-3xl scale-95 -z-10"></div>
                <div className="absolute top-4 inset-x-6 h-full bg-secondary/40 rounded-3xl scale-95 -z-10"></div>

                <div className="h-full w-full bg-black overflow-hidden shadow-2xl relative group p-3">
                  <Image
                    src="/phone-profile.png"
                    alt="Profile"
                    fill
                    sizes="(max-width: 768px) 280px, 340px"
                    loading="lazy"
                    quality={85}
                    priority={false}
                    className="object-cover rounded-2xl"
                  />
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
