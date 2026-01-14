"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Settings, LogOut } from "lucide-react"
import Image from "next/image"
import { GameDropdown, MobileGameMenu } from "@/components/GameDropdown"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/I18nProvider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

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

  return (
    <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={hrefWithLocale("/")} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Gamerplug Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <GameDropdown />
            <Link
              href={hrefWithLocale("/team")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.team}
            </Link>
            <Link
              href={hrefWithLocale("/contact")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* Right Side: Language Selector */}
          <div className="hidden md:flex items-center space-x-2">
            {(() => {
              const localeHref = (target: 'en' | 'es') => {
                const segs = (pathname?.split('/') || []);
                if (segs.length > 1) segs[1] = target;
                const nextPath = segs.join('/') || '/';
                return nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
              };
              return (
                <>
                  <Link
                    href={localeHref('en')}
                    className={`text-sm ${locale === 'en' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    EN
                  </Link>
                  <span className="text-muted-foreground/50">|</span>
                  <Link
                    href={localeHref('es')}
                    className={`text-sm ${locale === 'es' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    ES
                  </Link>
                </>
              );
            })()}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
            {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            <div>
              <div className="text-muted-foreground font-medium mb-2">{t.nav.games}</div>
              <MobileGameMenu onClose={() => setIsOpen(false)} />
            </div>
            <Link
              href={hrefWithLocale("/team")}
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.team}
            </Link>
            <Link
              href={hrefWithLocale("/contact")}
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.contact}
            </Link>
            <Link
              href={switchLocaleHref}
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {locale === 'en' ? 'ES' : 'EN'}
            </Link>
            <div className="pt-4 flex space-x-3 border-t border-border/50">
              <Button variant="outline" size="sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </Button>
              <Button variant="outline" size="sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
