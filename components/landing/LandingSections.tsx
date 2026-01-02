'use client'

import { Hero } from '@/components/landing/HeroClient'
import { HowItWorks } from '@/components/landing/HowItWorksClient'
import { CTASection } from '@/components/landing/CTASectionClient'

export function LandingSections() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CTASection />
    </>
  )
}

