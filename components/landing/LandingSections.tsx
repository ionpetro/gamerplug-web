'use client'

import dynamic from 'next/dynamic'

// Dynamic imports with SSR disabled for animation components
const Hero = dynamic(() => import('@/components/landing/HeroClient').then(mod => ({ default: mod.Hero })), {
  ssr: false,
  loading: () => (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center pt-32 md:pt-40 pb-20 md:pb-32 lg:py-0">
        <div className="z-10 min-w-0 opacity-100">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
            <span>🔥</span>
            <span>THE FUTURE OF GAMING</span>
          </div>
          <h1 className="flex flex-col text-6xl sm:text-7xl md:text-6xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
            <span style={{ color: '#FF0034' }}>FIND YOUR</span>
            <span>SQUAD</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 md:mb-10 max-w-lg leading-relaxed border-l-2 border-border pl-4 md:pl-6">
            Match with gamers who share your playstyle and skill level.
          </p>
        </div>
      </div>
    </section>
  )
})

const GameTicker = dynamic(() => import('@/components/landing/GameTickerClient').then(mod => ({ default: mod.GameTicker })), {
  ssr: false
})

const Features = dynamic(() => import('@/components/landing/FeaturesClient').then(mod => ({ default: mod.Features })), {
  ssr: false
})

const HowItWorks = dynamic(() => import('@/components/landing/HowItWorksClient').then(mod => ({ default: mod.HowItWorks })), {
  ssr: false
})

const CTASection = dynamic(() => import('@/components/landing/CTASectionClient').then(mod => ({ default: mod.CTASection })), {
  ssr: false
})

export function LandingSections() {
  return (
    <>
      <Hero />
      <GameTicker />
      <Features />
      <HowItWorks />
      <CTASection />
    </>
  )
}

