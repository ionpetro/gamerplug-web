'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getAllGames } from '@/lib/games'
import type { GameWithDetails } from '@/lib/games'

export const SupportedGamesPlatforms = () => {
  const [games, setGames] = useState<GameWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const allGames = await getAllGames()
        setGames(allGames)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">


        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-6 max-w-7xl mx-auto"
          >
            {games.map((game, idx) => (
              <motion.div
                key={game.id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center justify-center group"
              >
                <div className="relative w-full aspect-square bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-105 flex items-center justify-center">
                  <Image
                    src={game.image || '/placeholder.svg'}
                    alt={game.display_name}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

