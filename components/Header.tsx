'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Menu, User, LogOut } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { GameDropdown, MobileGameMenu } from "@/components/GameDropdown"
import { useI18n } from "@/components/I18nProvider"
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const context = useI18n()
  const t = context?.t || {}

  // Check for session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
  }

  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])

  const hrefWithLocale = (path: string) => `/${locale}${path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`)}`

  const switchLocaleHref = useMemo(() => {
    const segs = pathname?.split('/') || []
    const nextLocale = locale === 'en' ? 'es' : 'en'
    if (segs.length > 1) {
      segs[1] = nextLocale
    }
    const nextPath = segs.join('/') || '/'
    return nextPath.startsWith('/') ? nextPath : `/${nextPath}`
  }, [pathname, locale])

  const localeHref = (target: 'en' | 'es') => {
    const segs = (pathname?.split('/') || []);
    if (segs.length > 1) segs[1] = target;
    const nextPath = segs.join('/') || '/';
    return nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  };

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-background/95 md:backdrop-blur-md border-border py-3' : 'bg-transparent border-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href={hrefWithLocale("/")} className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 transform group-hover:scale-110 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Gamerplug Logo"
              width={32}
              height={32}
              quality={100}
              priority
              className="rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            />
          </div>
          <span className="hidden md:inline font-sans font-extrabold text-2xl tracking-tight italic">GAMER<span style={{ color: '#FF0034' }}>PLUG</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <GameDropdown />
          <Link
            href={hrefWithLocale("/team")}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.nav?.team || 'Team'}
          </Link>
          <Link
            href={hrefWithLocale("/blog")}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.nav?.blog || 'Blog'}
          </Link>
          <Link
            href={hrefWithLocale("/contact")}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.nav?.contact || 'Contact'}
          </Link>

          {/* Auth Buttons */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <User size={18} className="text-primary" />
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {session.user.email?.split('@')[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-white/10 shadow-xl overflow-hidden z-50">
                  <Link
                    href="/en/app"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={hrefWithLocale("/login")}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={hrefWithLocale("/signup")}
                className="py-2 px-4 rounded-lg bg-primary hover:bg-primary/90 text-sm font-bold uppercase tracking-wide transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border overflow-hidden">
          <div className="flex flex-col p-6 gap-4">
            <div>
              <div className="text-muted-foreground font-medium mb-2">{t.nav?.games || 'Games'}</div>
              <MobileGameMenu onClose={() => setIsMobileMenuOpen(false)} />
            </div>
            <Link
              href={hrefWithLocale("/team")}
              className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav?.team || 'Team'}
            </Link>
            <Link
              href={hrefWithLocale("/blog")}
              className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav?.blog || 'Blog'}
            </Link>
            <Link
              href={hrefWithLocale("/contact")}
              className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {locale === 'es' ? 'Contáctanos' : 'Contact Us'}
            </Link>
            {/* Mobile Auth Buttons */}
            {session ? (
              <>
                <Link
                  href="/en/app"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-300 hover:text-primary font-medium"
                >
                  <User size={18} className="text-primary" />
                  <span className="truncate">
                    My Profile
                  </span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-gray-300 hover:text-primary font-medium py-2"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href={hrefWithLocale("/login")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3 text-center border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href={hrefWithLocale("/signup")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3 gradient-accent text-white font-bold rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200 text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <Link
              href={hrefWithLocale("/download")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-3 mt-4 border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-200 text-center"
            >
              Download App
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
