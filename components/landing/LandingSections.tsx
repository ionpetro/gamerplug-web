'use client'

import { Hero } from '@/components/landing/HeroClient'
import { SupportedGamesPlatforms } from '@/components/landing/SupportedGamesPlatformsClient'
import { OurPromise } from '@/components/landing/PromiseClient'
import { CTASection } from '@/components/landing/CTASectionClient'

export function LandingSections() {
  return (
    <>
      <Hero />
      <SupportedGamesPlatforms />
      <OurPromise />
      <CTASection />
    </>
  )
}

