import type { Metadata } from 'next'
import AffiliatesPageClient from './AffiliatesPageClient'

const baseUrl = 'https://gamerplug.app'

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = rawLocale === 'es' ? 'es' : 'en'
  const localePrefix = locale === 'es' ? '/es' : '/en'
  const url = `${baseUrl}${localePrefix}/affiliates`
  
  const title = locale === 'es' 
    ? 'Programa de Afiliados | GamerPlug'
    : 'Affiliate Program | GamerPlug'
  const description = locale === 'es'
    ? 'Únete a nuestro escuadrón. Monetiza tu influencia. Ayúdanos a curar la soledad en el gaming. Programa de afiliados de GamerPlug para creadores de contenido.'
    : 'Join our squad. Monetize your influence. Help us cure gaming loneliness. GamerPlug affiliate program for content creators.'

  return {
    title,
    description,
    keywords: locale === 'es'
      ? ['programa de afiliados', 'afiliados gaming', 'monetizar gaming', 'influencers gaming', 'creadores de contenido gaming', 'GamerPlug afiliados']
      : ['affiliate program', 'gaming affiliates', 'monetize gaming', 'gaming influencers', 'gaming content creators', 'GamerPlug affiliate'],
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/affiliates`,
        'es': `${baseUrl}/es/affiliates`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url,
      siteName: 'GamerPlug',
      title,
      description,
      images: [
        {
          url: `${baseUrl}/og.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'es' ? 'GamerPlug - Programa de Afiliados' : 'GamerPlug - Affiliate Program',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@The_Gamer_Plug',
      creator: '@The_Gamer_Plug',
      title,
      description,
      images: [`${baseUrl}/og.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function LocalizedAffiliates() {
  return <AffiliatesPageClient />
}
