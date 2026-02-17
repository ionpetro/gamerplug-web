"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { GameWithDetails, getAllGames } from "@/lib/games"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/I18nProvider"

let cachedGames: GameWithDetails[] | null = null
let gamesPromise: Promise<GameWithDetails[]> | null = null

async function loadGamesCached(): Promise<GameWithDetails[]> {
  if (cachedGames) return cachedGames
  if (!gamesPromise) {
    gamesPromise = getAllGames().then((games) => {
      cachedGames = games
      return games
    }).finally(() => {
      gamesPromise = null
    })
  }
  return gamesPromise
}

export function GameDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [games, setGames] = useState<GameWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const context = useI18n()
  const t = context?.t || {}

  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])

  const hrefWithLocale = (path: string) => `/${locale}${path.startsWith('/') ? path : `/${path}`}`

  useEffect(() => {
    async function fetchGames() {
      try {
        const gamesList = await loadGamesCached()
        setGames(gamesList)
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150) // 150ms delay
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link
        href={hrefWithLocale("/games")}
        className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{t.nav?.games || 'Games'}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {/* Invisible bridge to prevent menu from closing */}
      {isOpen && (
        <div className="absolute top-full right-0 w-full h-2 bg-transparent" />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-card/95 backdrop-blur-lg border border-border/50 rounded-lg shadow-xl min-w-[280px] z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-4">
            <div className="text-sm font-semibold text-muted-foreground mb-3 px-2">
              {t.dropdown?.allGames || 'All Games'}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    href={hrefWithLocale(`/games/${game.slug}`)}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-primary/10 transition-colors group"
                  >
                    <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      <Image
                        src={game.image || '/images/games/placeholder.webp'}
                        alt={game.display_name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to a default image if the game image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {game.display_name}
                      </div>
                      {game.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {game.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                
                {games.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No games available
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-border/50">
              <Link
                href={hrefWithLocale("/games")}
                className="block text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {t.dropdown?.viewAll || 'View All Games'} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function MobileGameMenu({ onClose }: { onClose: () => void }) {
  const [games, setGames] = useState<GameWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  
  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])

  const hrefWithLocale = (path: string) => `/${locale}${path.startsWith('/') ? path : `/${path}`}`

  useEffect(() => {
    async function fetchGames() {
      try {
        const gamesList = await loadGamesCached()
        setGames(gamesList)
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  return (
    <div className="py-2 space-y-2">
      <Link
        href={hrefWithLocale("/games")}
        className="block text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
        onClick={onClose}
      >
        All Games
      </Link>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="text-xs font-semibold text-muted-foreground px-2 mt-3 mb-2">
            All Games
          </div>
          {games.map((game) => (
            <Link
              key={game.id}
              href={hrefWithLocale(`/games/${game.slug}`)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-primary/10 transition-colors"
              onClick={onClose}
            >
              <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0 bg-muted">
                <Image
                  src={game.image || '/placeholder.svg'}
                  alt={game.display_name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {game.display_name}
              </span>
            </Link>
          ))}
        </>
      )}
    </div>
  )
}
