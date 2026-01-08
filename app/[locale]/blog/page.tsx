import { Metadata } from "next"
import { Suspense } from "react"
import { BlogListClient } from "./BlogListClient"
import { getAllBlogPosts } from "@/lib/blog"

const baseUrl = 'https://gamerplug.app'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ]
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = rawLocale === 'es' ? 'es' : 'en'
  const localePrefix = locale === 'es' ? '/es' : '/en'
  const url = `${baseUrl}${localePrefix}/blog`
  
  const title = locale === 'es' ? 'Blog | GamerPlug' : 'Blog | GamerPlug'
  const description = locale === 'es' 
    ? 'Consejos de gaming, estrategias y noticias. Todo lo que necesitas para mejorar tu juego y encontrar tu escuadrón perfecto.'
    : 'Gaming tips, strategies, and news. Everything you need to level up your game and find your perfect squad.'

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/blog`,
        'es': `${baseUrl}/es/blog`,
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
          alt: 'GamerPlug Blog',
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
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: rawLocale } = await params
  const locale = rawLocale === 'es' ? 'es' : 'en'
  const blogPosts = getAllBlogPosts()

  return (
    <>
      {/* Structured Data - Blog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'GamerPlug Blog',
            description: 'Gaming tips, strategies, and news. Everything you need to level up your game and find your perfect squad.',
            url: `${baseUrl}/${locale}/blog`,
            publisher: {
              '@type': 'Organization',
              name: 'GamerPlug',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo-new.png`,
              },
            },
            blogPost: blogPosts.slice(0, 10).map(post => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              url: `${baseUrl}/${locale}/blog/${post.slug}`,
              datePublished: new Date(post.date).toISOString(),
              author: {
                '@type': 'Person',
                name: post.author,
              },
            })),
          }),
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${baseUrl}/${locale}`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${baseUrl}/${locale}/blog`,
              },
            ],
          }),
        }}
      />

      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }>
        <BlogListClient posts={blogPosts} locale={locale} />
      </Suspense>
    </>
  )
}
