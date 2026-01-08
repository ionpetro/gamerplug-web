'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import { Footer } from "@/components/Footer"
import { useI18n } from "@/components/I18nProvider"
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { BlogPost } from "@/lib/blog"

interface BlogPostClientProps {
  post: BlogPost
  locale: string
}

export function BlogPostClient({ post, locale }: BlogPostClientProps) {
  const pathname = usePathname()
  const { t } = useI18n()

  const hrefWithLocale = (path: string) => `/${locale}${path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`)}`

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center pt-24 overflow-hidden bg-background">
        {/* Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[120px] -z-10"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-20"></div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button and Badge Row */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <Link
                href={hrefWithLocale("/blog")}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {locale === 'es' ? 'Volver al blog' : 'Back to Blog'}
              </Link>

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
              >
                <Calendar size={12} />
                {t.blog?.badge || 'Yapping'}
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight break-words">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 relative bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <article className="max-w-4xl mx-auto">
            {/* Featured Image Placeholder */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-secondary to-card border border-border rounded-2xl mb-12 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-invert prose-lg max-w-none"
              style={{
                color: 'var(--foreground)',
              }}
            >
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  lineHeight: '1.8',
                }}
              />
            </motion.div>

            {/* Back to Blog CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 pt-8 border-t border-border"
            >
              <Link
                href={hrefWithLocale("/blog")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border hover:border-primary/50 rounded-lg text-foreground hover:text-primary transition-all duration-300 font-bold text-sm group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {locale === 'es' ? 'Volver al blog' : 'Back to Blog'}
              </Link>
            </motion.div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  )
}

