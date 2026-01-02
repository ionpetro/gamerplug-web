import { Footer } from "@/components/Footer"
import { LandingSections } from "@/components/landing/LandingSections"

// --- Main Page ---

export default function LocalizedHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://gamerplug.app/#organization',
        name: 'GamerPlug',
        url: 'https://gamerplug.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gamerplug.app/logo.png',
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://x.com/The_Gamer_Plug',
          'https://discord.gg/gamerplug',
          'https://www.tiktok.com/@thegamerplugapp',
          'https://www.linkedin.com/company/gamerplug',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+306988617790',
          contactType: 'customer support',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://gamerplug.app/#website',
        url: 'https://gamerplug.app',
        name: 'GamerPlug',
        description: 'Find your perfect gaming squad. Match with gamers who share your playstyle and skill level.',
        publisher: {
          '@id': 'https://gamerplug.app/#organization',
        },
        inLanguage: ['en', 'es'],
      },
      {
        '@type': 'WebApplication',
        name: 'GamerPlug',
        url: 'https://gamerplug.app',
        applicationCategory: 'GameApplication',
        operatingSystem: 'iOS, Android',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '12405',
        },
        description: 'AI-powered gaming matchmaking app. Find teammates based on stats, playstyle, and vibes. Connect across PC, PlayStation, Xbox, and mobile.',
      },
    ],
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <LandingSections />
      </main>
      <Footer />
    </div>
  )
}
