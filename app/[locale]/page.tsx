'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Users, Zap, MessageCircle, Download, Trophy, Shield, Flame, Smartphone, Crosshair, X, Menu } from 'lucide-react'
import { Footer } from "@/components/Footer"
import DownloadButton from "@/components/DownloadButton"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { GameDropdown, MobileGameMenu } from "@/components/GameDropdown"
import { useI18n } from "@/components/I18nProvider"

// --- Types ---
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  comingSoon?: boolean
}

// --- Components ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t, locale: currentLocale } = useI18n()

  const locale = useMemo(() => {
    return currentLocale || "en"
  }, [currentLocale])

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
          <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform duration-300">
            <Image
              src="/logo-new.png"
              alt="Gamerplug Logo"
              width={40}
              height={40}
              className="rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            />
          </div>
          <span className="font-black text-lg tracking-wider" style={{ fontWeight: 900 }}>GAMER<span className="text-primary">PLUG</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.landing.header.features}
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.landing.header.howItWorks}
          </a>
          <GameDropdown />
          <Link
            href={hrefWithLocale("/contact")}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
          >
            {t.nav.contact}
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

          <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-accent transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5">
            <Download size={16} />
            {t.landing.header.downloadApp}
          </button>
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
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              >
                {t.landing.header.features}
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
              >
                {t.landing.header.howItWorks}
              </a>
              <div>
                <div className="text-muted-foreground font-medium mb-2">{t.nav.games}</div>
                <MobileGameMenu onClose={() => setIsMobileMenuOpen(false)} />
              </div>
              <Link
                href={hrefWithLocale("/contact")}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>
              <Link
                href={switchLocaleHref}
                className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {locale === 'en' ? 'ES' : 'EN'}
              </Link>
              <button className="w-full py-3 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-accent transition-colors">{t.landing.header.downloadNow}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const Hero = () => {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-accent/20 rounded-full blur-[150px]"></div>

      {/* Abstract Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 blur-[120px] rounded-full"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center pt-32 md:pt-40 pb-20 md:pb-32 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider"
          >
            <Flame size={12} />
            {t.landing.hero.badge}
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
            {t.landing.hero.title1}<br />
            {t.landing.hero.title2}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t.landing.hero.title3}</span>
          </h1>

          <p className="text-muted-foreground text-sm md:text-base lg:text-lg mb-8 md:mb-10 max-w-lg leading-relaxed border-l-2 border-border pl-4 md:pl-6">
            {t.landing.hero.subtitle}
          </p>

          <div className="flex flex-row gap-4 w-full">
            <DownloadButton />
          </div>
        </motion.div>

        {/* Phone Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.2 }}
          className="relative flex justify-center z-10 scale-[0.6] sm:scale-75 lg:scale-90"
        >
          <div className="relative w-[340px] h-[680px] bg-background border-[8px] border-secondary rounded-[3rem] shadow-2xl overflow-hidden animate-float">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-secondary rounded-b-2xl z-20"></div>

            {/* Screen Content */}
            <div className="relative w-full h-full bg-card flex flex-col">
              {/* Profile Card */}
              <div className="flex-1 relative overflow-hidden">
                {/* Card Stack Effect */}
                <div className="absolute top-6 inset-x-8 h-full bg-secondary/20 rounded-3xl scale-95 -z-10"></div>
                <div className="absolute top-4 inset-x-6 h-full bg-secondary/40 rounded-3xl scale-95 -z-10"></div>

                <div className="h-full w-full bg-black overflow-hidden shadow-2xl relative group p-3">
                  <img src="/phone-profile.png" className="w-full h-full object-cover rounded-2xl" alt="Profile" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements around Phone */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-32 -right-8 bg-card/95 backdrop-blur p-4 rounded-xl border border-border flex items-center gap-3 shadow-2xl z-20 max-w-[200px]"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
              <Trophy size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold">{t.landing.phone.rankMatch}</div>
              <div className="text-sm font-bold text-foreground">{t.landing.phone.topPlayer}</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            className="absolute bottom-40 -left-12 bg-card/95 backdrop-blur p-4 rounded-xl border border-border flex items-center gap-3 shadow-2xl z-20"
          >
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
              <MessageCircle size={20} className="text-accent" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold">{t.landing.phone.newMessage}</div>
              <div className="text-sm font-bold text-foreground">{t.landing.phone.duoMessage}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon, title, description, delay, comingSoon }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {comingSoon && (
      <div className="absolute top-4 right-4 z-20">
        <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded border border-primary uppercase tracking-wide">
          Coming Soon
        </span>
      </div>
    )}

    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
      {icon}
    </div>

    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-gray-300 transition-colors relative z-10">{description}</p>
  </motion.div>
)

const Features = () => {
  const { t } = useI18n()

  return (
    <section id="features" className="py-32 relative bg-background overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            {t.landing.features.sectionLabel}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 uppercase italic"
          >
            {t.landing.features.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t.landing.features.titleHighlight}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            {t.landing.features.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap size={28} />}
            title={t.landing.features.aiMatching}
            description={t.landing.features.aiMatchingDesc}
            delay={0.1}
          />
          <FeatureCard
            icon={<Users size={28} />}
            title={t.landing.features.squadBuilder}
            description={t.landing.features.squadBuilderDesc}
            delay={0.2}
          />
          <FeatureCard
            icon={<Shield size={28} />}
            title={t.landing.features.toxicFree}
            description={t.landing.features.toxicFreeDesc}
            delay={0.3}
          />
          <FeatureCard
            icon={<Crosshair size={28} />}
            title={t.landing.features.platformSync}
            description={t.landing.features.platformSyncDesc}
            delay={0.4}
            comingSoon={true}
          />
          <FeatureCard
            icon={<Trophy size={28} />}
            title={t.landing.features.tournaments}
            description={t.landing.features.tournamentsDesc}
            delay={0.5}
            comingSoon={true}
          />
          <FeatureCard
            icon={<MessageCircle size={28} />}
            title={t.landing.features.lowLatency}
            description={t.landing.features.lowLatencyDesc}
            delay={0.6}
            comingSoon={true}
          />
        </div>
      </div>
    </section>
  )
}

const HowItWorks = () => {
  const { t } = useI18n()

  const steps = [
    { id: "01", title: t.landing.howItWorks.step1Title, desc: t.landing.howItWorks.step1Desc },
    { id: "02", title: t.landing.howItWorks.step2Title, desc: t.landing.howItWorks.step2Desc },
    { id: "03", title: t.landing.howItWorks.step3Title, desc: t.landing.howItWorks.step3Desc }
  ]

  return (
    <section id="how-it-works" className="py-32 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none mb-6">
            {t.landing.howItWorks.title1} <br/><span className="text-primary">{t.landing.howItWorks.title2}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t.landing.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative group"
            >
              <div className="bg-card border border-border p-10 rounded-3xl h-full hover:border-primary transition-colors duration-500 relative overflow-hidden">
                {/* Big Number BG */}
                <span className="absolute -bottom-4 -right-4 text-9xl font-black text-secondary/40 group-hover:text-primary/10 transition-colors select-none">
                  {step.id}
                </span>

                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold border border-border mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                  {step.id}
                </div>

                <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const GameTicker = () => {
  const games = ["VALORANT", "APEX LEGENDS", "LEAGUE OF LEGENDS", "CALL OF DUTY", "OVERWATCH 2", "FORTNITE", "CS:GO", "MINECRAFT", "ROCKET LEAGUE", "DOTA 2"]

  return (
    <div className="py-12 bg-background border-y border-border overflow-hidden flex relative z-20">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none"></div>
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {[...games, ...games].map((game, i) => (
          <span key={i} className="text-5xl md:text-6xl font-black text-muted-foreground/50 uppercase tracking-tighter hover:text-primary transition-colors cursor-default italic">
            {game}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const CTASection = () => {
  const { t } = useI18n()

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent"></div>
          <div className="absolute inset-[2px] bg-background rounded-[2.4rem]"></div>

          <div className="bg-card/50 backdrop-blur-xl rounded-[2.4rem] p-12 md:p-24 text-center relative overflow-hidden z-10 m-[2px]">
            {/* Abstract Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-3xl -z-10"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground uppercase italic leading-none">
                {t.landing.cta.title1}<br/>{t.landing.cta.title2} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t.landing.cta.titleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-10">
                {t.landing.cta.subtitle}
              </p>
              <div className="flex flex-row gap-4 w-full">
                <DownloadButton />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// --- Main Page ---

export default function LocalizedHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://gamerplug.app/#organization',
        name: 'GamerPlug',
        url: 'https://gamerplug.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gamerplug.app/logo-new.png',
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://x.com/The_Gamer_Plug',
          'https://discord.gg/gamerplug',
          'https://www.tiktok.com/@thegamerplugapp',
          'https://www.linkedin.com/company/gamerplug',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@gamerplug.app',
          contactType: 'customer support',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://gamerplug.app/#website',
        url: 'https://gamerplug.app',
        name: 'GamerPlug',
        description: 'Find your perfect gaming squad. Match with gamers who share your playstyle and skill level.',
        publisher: {
          '@id': 'https://gamerplug.app/#organization',
        },
        inLanguage: ['en', 'es'],
      },
      {
        '@type': 'WebApplication',
        name: 'GamerPlug',
        url: 'https://gamerplug.app',
        applicationCategory: 'GameApplication',
        operatingSystem: 'iOS, Android',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '12405',
        },
        description: 'AI-powered gaming matchmaking app. Find teammates based on stats, playstyle, and vibes. Connect across PC, PlayStation, Xbox, and mobile.',
      },
    ],
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <GameTicker />
        <Features />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
