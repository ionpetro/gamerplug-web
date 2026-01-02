'use client'

import { motion } from 'framer-motion'
import { Zap, Users, Shield, Crosshair, Trophy, MessageCircle } from 'lucide-react'
import { FeatureCard } from './FeatureCardClient'
import { useI18n } from "@/components/I18nProvider"

export const Features = () => {
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

