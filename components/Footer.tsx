"use client"

import { useI18n } from "@/components/I18nProvider"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export function Footer() {
  const context = useI18n()
  const t = context?.t || {}
  const locale = context?.locale || 'en'
  const pathname = usePathname()

  const localeHref = (target: 'en' | 'es') => {
    const segs = (pathname?.split('/') || []);
    if (segs.length > 1) segs[1] = target;
    const nextPath = segs.join('/') || '/';
    return nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  }

  // Fallback messages if context is missing
  const fallbackMessages = {
    footer: {
      tagline: "The ultimate social platform for gamers. Find your squad, build your community, and never game alone again.",
      company: "Company",
      aboutUs: "About Us",
      careers: "Careers",
      pressKit: "Press Kit",
      support: "Support",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cookies: "Cookies",
      copyright: "GamerPlug Inc."
    }
  }

  const messages = t.footer ? t : fallbackMessages

  return (
    <footer id="community" className="bg-background pt-24 pb-10 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 pr-8">
            <Link href={`/${locale}`} className="flex items-center gap-3 group cursor-pointer mb-6">
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
              <span className="font-sans font-extrabold text-2xl tracking-tight italic">GAMER<span style={{ color: '#FF0034' }}>PLUG</span></span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              {messages.footer.tagline}
            </p>
            <div className="flex gap-4">
              {/* Twitter */}
              <a href="https://x.com/The_Gamer_Plug" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Discord */}
              <a href="https://discord.gg/gamerplug" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <span className="sr-only">Discord</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@thegamerplugapp?lang=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <span className="sr-only">TikTok</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/306988617790" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <span className="sr-only">WhatsApp</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-8 uppercase tracking-widest text-sm">{messages.footer.company}</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
              <li><a href="https://www.linkedin.com/company/gamer-plug" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{messages.footer.aboutUs}</a></li>
              <li><Link href={`/${locale}/team`} className="hover:text-primary transition-colors">{messages.footer.team}</Link></li>
              <li><a href="https://www.linkedin.com/company/gamer-plug/jobs/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{messages.footer.careers}</a></li>
              <li><Link href={`/${locale}/affiliates`} className="hover:text-primary transition-colors">{messages.footer.affiliates || 'Affiliates'}</Link></li>
              <li><Link href={`/${locale}/leaderboard`} className="hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-8 uppercase tracking-widest text-sm">{messages.footer.support}</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
              <li><Link href={`/${locale}/tac`} className="hover:text-primary transition-colors">{messages.footer.terms}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{messages.footer.privacy}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-primary transition-colors">{messages.footer.contact || 'Contact Us'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs font-medium uppercase tracking-wider">
          <div>&copy; {new Date().getFullYear()} {messages.footer.copyright}</div>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-gray-400">{messages.footer.privacy}</Link>
            <Link href={`/${locale}/tac`} className="hover:text-gray-400">{messages.footer.terms}</Link>
            <a href="#" className="hover:text-gray-400">{messages.footer.cookies}</a>
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
        </div>
      </div>
    </footer>
  )
}
