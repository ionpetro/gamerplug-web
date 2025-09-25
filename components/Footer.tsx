"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])
  const hrefWithLocale = (path: string) => `/${locale}${path.startsWith('/') ? path : `/${path}`}`
  return (
    <footer className="py-12 px-4 bg-card/50 border-t border-border/50">
      <div className="container mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gamerplug
          </h3>
          <p className="text-muted-foreground mb-6">Connecting gamers, building communities, creating legends.</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href={hrefWithLocale("/privacy")} className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href={hrefWithLocale("/tac")} className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href={hrefWithLocale("/contact")} className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">© 2025 Gamerplug. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}