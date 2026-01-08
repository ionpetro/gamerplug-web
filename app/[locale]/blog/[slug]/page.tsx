import { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPostClient } from "./BlogPostClient"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog"

const baseUrl = 'https://gamerplug.app'

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  const locales = ['en', 'es']
  
  return posts.flatMap(post => 
    locales.map(locale => ({
      slug: post.slug,
      locale,
    }))
  )
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  const { slug, locale } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const localePrefix = locale === 'es' ? '/es' : '/en'
  const url = `${baseUrl}${localePrefix}/blog/${slug}`
  const ogImage = `${baseUrl}/og.jpg`

  // Format date for article metadata
  const publishedTime = new Date(post.date).toISOString()
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/blog/${slug}`,
        'es': `${baseUrl}/es/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url,
      siteName: 'GamerPlug',
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'GamerPlug - Find Your Gaming Squad',
          type: 'image/jpeg',
        },
      ],
      publishedTime,
      authors: [post.author],
      section: post.category,
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@The_Gamer_Plug',
      creator: '@The_Gamer_Plug',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    other: {
      'article:published_time': publishedTime,
      'article:author': post.author,
      'article:section': post.category,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale: rawLocale } = await params
  const locale = rawLocale === 'es' ? 'es' : 'en'
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.image.startsWith('http') 
              ? post.image 
              : `${baseUrl}${post.image}`,
            datePublished: new Date(post.date).toISOString(),
            dateModified: new Date(post.date).toISOString(),
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'GamerPlug',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo-new.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/${locale}/blog/${slug}`,
            },
            articleSection: post.category,
            keywords: post.category,
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
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `${baseUrl}/${locale}/blog/${slug}`,
              },
            ],
          }),
        }}
      />

      <BlogPostClient post={post} locale={locale} />
    </>
  )
}
