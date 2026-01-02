'use client'

import { Hero } from '@/components/landing/HeroClient'
import { GameTicker } from '@/components/landing/GameTickerClient'
import { Features } from '@/components/landing/FeaturesClient'
import { HowItWorks } from '@/components/landing/HowItWorksClient'
import { CTASection } from '@/components/landing/CTASectionClient'

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

