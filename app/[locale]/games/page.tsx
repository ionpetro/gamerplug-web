'use client'

import { motion } from "framer-motion"
import { Users, Gamepad2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Footer } from "@/components/Footer"
import { GamesPageSkeleton } from "@/components/skeletons/GamesPageSkeleton"

interface Game {
  id: string
  slug: string
  display_name: string
  description?: string
  image?: string | null
  color?: string
  rating?: number
  playerCount?: string
  genres?: string[]
}

export default function LocalizedGames({ params }: { params: Promise<{ locale: string }> }) {
  const [games, setGames] = useState<Game[]>([])
  const [locale, setLocale] = useState<string>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const resolvedParams = await params
        if (!isMounted) return
        setLocale(resolvedParams.locale)

        // Import games dynamically
        const { getAllGames } = await import('@/lib/games')
        const gamesData = await getAllGames()
        if (!isMounted) return
        setGames(gamesData)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [params])

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
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider"
            >
              <Gamepad2 size={12} />
              {locale === 'es' ? 'Encuentra tu juego' : 'Find Your Game'}
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
              POPULAR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GAMES.</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {locale === 'es'
                ? 'Encuentra tu comunidad en los títulos más populares. Conecta con jugadores que comparten tu pasión y nivel.'
                : 'Find your gaming community in the most popular titles. Connect with players who share your passion and skill level.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-20 px-4 relative bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          {isLoading ? (
            <GamesPageSkeleton className="max-w-7xl mx-auto" />
          ) : games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {locale === 'es' ? 'No se encontraron juegos. Vuelve más tarde.' : 'No games found. Please check back later.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {games.map((game, idx) => (
                <Link key={game.id} href={`/${locale}/games/${game.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={game.image || ''}
                        alt={game.display_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>

                    <div className="p-6 relative z-10">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {game.display_name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                        {game.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(game.genres || []).slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-md font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-muted-foreground text-sm">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-medium">{locale === 'es' ? 'Comunidad activa' : 'Active Community'}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
