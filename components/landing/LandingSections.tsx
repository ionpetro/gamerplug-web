'use client'

import { Hero } from '@/components/landing/HeroClient'
import { SupportedGamesPlatforms } from '@/components/landing/SupportedGamesPlatformsClient'
import { OurPromise } from '@/components/landing/PromiseClient'
import { TeamSection } from '@/components/landing/TeamSectionClient'
import { CTASection } from '@/components/landing/CTASectionClient'

export function LandingSections() {
  return (
    <>
      <Hero />
      <SupportedGamesPlatforms />
      <OurPromise />
      <TeamSection />
      <CTASection />
    </>
  )
}

