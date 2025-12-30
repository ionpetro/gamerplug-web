'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Menu } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { GameDropdown, MobileGameMenu } from "@/components/GameDropdown"
import { useI18n } from "@/components/I18nProvider"

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const context = useI18n()
  const t = context?.t || {}

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-background/90 backdrop-blur-md border-border py-3' : 'bg-transparent border-transparent py-6'}`}>
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
          <Link
            href={`${hrefWithLocale("/")}#features`}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            Features
          </Link>
          <Link
            href={`${hrefWithLocale("/")}#how-it-works`}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            How it Works
          </Link>
          <GameDropdown />
          <Link
            href={hrefWithLocale("/contact")}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.nav?.contact || 'Contact'}
          </Link>

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Link
              href={localeHref('en')}
              className={`text-sm ${locale === 'en' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              EN
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link
              href={localeHref('es')}
              className={`text-sm ${locale === 'es' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              ES
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link
                href={`${hrefWithLocale("/")}#features`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              >
                Features
              </Link>
              <Link
                href={`${hrefWithLocale("/")}#how-it-works`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              >
                How it Works
              </Link>
              <div>
                <div className="text-muted-foreground font-medium mb-2">{t.nav?.games || 'Games'}</div>
                <MobileGameMenu onClose={() => setIsMobileMenuOpen(false)} />
              </div>
              <Link
                href={hrefWithLocale("/contact")}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {locale === 'es' ? 'Contáctanos' : 'Contact Us'}
              </Link>
              <Link
                href={switchLocaleHref}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {locale === 'en' ? 'ES' : 'EN'}
              </Link>
              <Link
                href={hrefWithLocale("/download")}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-3 mt-4 gradient-accent text-white font-bold rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200 text-center"
              >
                Download Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
