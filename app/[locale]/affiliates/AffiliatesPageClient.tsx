'use client'

import { motion } from 'framer-motion'
import { Footer } from '@/components/Footer'
import { Video, Shield, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'

export default function AffiliatesPageClient() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center pt-24 pb-12 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-10"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 -z-10"></div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
              {t.affiliates.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-6">
              {t.affiliates.title} <span className="text-primary">{t.affiliates.titleHighlight}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t.affiliates.subtitle}
            </p>
            <Link
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200"
            >
              {t.affiliates.applyNow}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <motion.div
            id="apply"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-4">{t.affiliates.applyTitle}</h2>
            <p className="text-muted-foreground mb-8">{t.affiliates.applyDesc}</p>
            <div className="w-full">
              <iframe
                src="https://tally.so/embed/kdGWZZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                width="100%"
                height="900"
                frameBorder="0"
                title={t.affiliates.applyTitle}
                aria-label={t.affiliates.applyDesc}
                className="rounded-lg"
                style={{ overflow: 'hidden' }}
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is GamerPlug Section */}
      <section className="pt-12 pb-24 relative overflow-hidden bg-card/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
                {t.affiliates.whatIsTitle} <span className="text-primary">{t.affiliates.titleHighlight}</span>?
              </h2>
              <p className="text-muted-foreground text-sm uppercase tracking-wide mb-4">{t.affiliates.whatIsSubtitle}</p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t.affiliates.whatIsDesc1}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.affiliates.whatIsDesc2}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative mx-auto max-w-[300px]">
                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full -z-10"></div>
                <Image
                  src="/phone-profile.png"
                  alt={t.affiliates.titleHighlight + " - " + (t.affiliates.whatIsSubtitle || "Gaming social platform interface")}
                  width={300}
                  height={600}
                  className="mx-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Your Audience Will Care Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">{t.affiliates.whyCareTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.affiliates.whyCareSubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Clip-First Profiles */}
            <article
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                  <Video className="w-6 h-6 text-primary group-hover:text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2 relative z-10">{t.affiliates.clipFirstTitle}</h3>
                <p className="text-muted-foreground text-sm relative z-10">{t.affiliates.clipFirstDesc}</p>
              </motion.div>
            </article>

            {/* Safety & Integrity */}
            <article
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                  <Shield className="w-6 h-6 text-primary group-hover:text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2 relative z-10">{t.affiliates.safetyTitle}</h3>
                <p className="text-muted-foreground text-sm relative z-10">{t.affiliates.safetyDesc}</p>
              </motion.div>
            </article>

            {/* Future Features */}
            <article
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                  <Calendar className="w-6 h-6 text-primary group-hover:text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2 relative z-10">{t.affiliates.futureFeaturesTitle}</h3>
                <p className="text-muted-foreground text-sm relative z-10">{t.affiliates.futureFeaturesDesc}</p>
              </motion.div>
            </article>

          </div>
        </div>
      </section>

      {/* The Team Section */}
      <section className="py-24 relative overflow-hidden bg-card/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">{t.affiliates.teamTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.affiliates.teamSubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Stephanos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-border">
                <Image
                  src="/images/team/stephanos.png"
                  alt={`${t.affiliates.stephanosName} - ${t.affiliates.stephanosRole} at GamerPlug`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{t.affiliates.stephanosName}</h3>
              <p className="text-primary font-medium text-sm mb-4">{t.affiliates.stephanosRole}</p>
              <p className="text-muted-foreground text-sm">{t.affiliates.stephanosDesc}</p>
            </motion.div>

            {/* Hunter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-card border border-border text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-border">
                <Image
                  src="/images/team/hunter.png"
                  alt={`${t.affiliates.hunterName} - ${t.affiliates.hunterRole} at GamerPlug`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{t.affiliates.hunterName}</h3>
              <p className="text-primary font-medium text-sm mb-4">{t.affiliates.hunterRole}</p>
              <p className="text-muted-foreground text-sm">{t.affiliates.hunterDesc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
