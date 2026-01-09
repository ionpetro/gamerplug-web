'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/components/I18nProvider"
import { useMemo, useState, useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { BlogPost } from "@/lib/blog"

const POSTS_PER_PAGE = 6

interface BlogListClientProps {
  posts: BlogPost[]
  locale: string
}

export function BlogListClient({ posts, locale: initialLocale }: BlogListClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useI18n()
  
  const [currentPage, setCurrentPage] = useState(1)

  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // Initialize page from URL search params
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10)
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [searchParams, totalPages])

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = posts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Update URL without causing a full page reload
      const params = new URLSearchParams(searchParams.toString())
      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', page.toString())
      }
      router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
      // Scroll to top of blog posts section
      window.scrollTo({ top: 600, behavior: 'smooth' })
    }
  }

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
      <section className="relative min-h-[60vh] flex items-center pt-24 overflow-hidden bg-background">
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
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider"
            >
              <Calendar size={12} />
              {t.blog?.badge || 'Blog'}
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
              {t.blog?.title || 'BLOG'}
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {t.blog?.subtitle || 'Gaming tips, strategies, and news. Everything you need to level up your game and find your perfect squad.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 relative bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {currentPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={hrefWithLocale(`/blog/${post.slug}`)}>
                  <Card className="h-full bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-[0_0_30px_rgba(255,0,52,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-secondary to-card border-b border-border overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
                          <Calendar className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    </div>

                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all duration-300">
                        {t.blog?.readMore || 'Read More'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground flex items-center gap-2 font-bold text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                {locale === 'es' ? 'Anterior' : 'Previous'}
              </button>

              <div className="flex items-center gap-2">
                {(() => {
                  const pages: (number | string)[] = []
                  
                  // Always show first page
                  pages.push(1)
                  
                  // Add ellipsis if needed before current page range
                  if (currentPage > 3) {
                    pages.push('ellipsis-start')
                  }
                  
                  // Show pages around current page
                  const startPage = Math.max(2, currentPage - 1)
                  const endPage = Math.min(totalPages - 1, currentPage + 1)
                  
                  for (let i = startPage; i <= endPage; i++) {
                    if (i !== 1 && i !== totalPages) {
                      pages.push(i)
                    }
                  }
                  
                  // Add ellipsis if needed after current page range
                  if (currentPage < totalPages - 2) {
                    pages.push('ellipsis-end')
                  }
                  
                  // Always show last page if there's more than one page
                  if (totalPages > 1) {
                    pages.push(totalPages)
                  }
                  
                  return pages.map((page, idx) => {
                    if (typeof page === 'string') {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-primary text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                            : 'bg-card border border-border text-foreground hover:border-primary/50 hover:text-primary'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })
                })()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground flex items-center gap-2 font-bold text-sm"
              >
                {locale === 'es' ? 'Siguiente' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-32 bg-secondary/20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              {t.blog?.stayUpdated || 'Stay Updated'}
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase italic">
              {t.blog?.dontMiss || "Don't Miss"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t.blog?.out || 'Out'}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t.blog?.newsletterDesc || 'Subscribe to get the latest gaming news, tips, and updates delivered straight to your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t.blog?.emailPlaceholder || 'Your email address'}
                className="flex-1 px-6 py-4 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-accent transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5">
                {t.blog?.subscribe || 'Subscribe'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}


