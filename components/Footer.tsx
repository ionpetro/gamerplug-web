"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/I18nProvider"

export function Footer() {
  const pathname = usePathname()
  const { t } = useI18n()
  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])
  const hrefWithLocale = (path: string) => `/${locale}${path.startsWith('/') ? path : `/${path}`}`
  
  // Default fallback values when i18n context is not available
  const footerText = {
    tagline: t?.footer?.tagline || "Connecting gamers, building communities, creating legends.",
    privacy: t?.footer?.privacy || "Privacy Policy",
    terms: t?.footer?.terms || "Terms of Service", 
    contact: t?.footer?.contact || "Contact",
    copyright: t?.footer?.copyright || "All rights reserved."
  }
  return (
    <footer className="py-12 px-4 bg-card/50 border-t border-border/50">
      <div className="container mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gamerplug
          </h3>
          <p className="text-muted-foreground mb-6">{footerText.tagline}</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href={hrefWithLocale("/privacy")} className="hover:text-primary transition-colors">
              {footerText.privacy}
            </Link>
            <Link href={hrefWithLocale("/tac")} className="hover:text-primary transition-colors">
              {footerText.terms}
            </Link>
            <Link href={hrefWithLocale("/contact")} className="hover:text-primary transition-colors">
              {footerText.contact}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">© 2025 Gamerplug. {footerText.copyright}</p>
        </div>
      </div>
    </footer>
  )
}