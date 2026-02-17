import { Hero } from '@/components/landing/HeroClient'
import { DemoVideo } from '@/components/landing/DemoVideoClient'
import { SupportedGamesPlatforms } from '@/components/landing/SupportedGamesPlatformsClient'
import { OurPromise } from '@/components/landing/PromiseClient'
import { TeamSection } from '@/components/landing/TeamSectionClient'
import { CTASection } from '@/components/landing/CTASectionClient'

export async function LandingSections() {
  return (
    <>
      <Hero />
      <DemoVideo />
      <SupportedGamesPlatforms />
      <OurPromise />
      <TeamSection />
      <CTASection />
    </>
  )
}
