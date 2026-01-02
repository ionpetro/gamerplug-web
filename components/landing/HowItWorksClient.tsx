'use client'

import { motion } from 'framer-motion'
import { useI18n } from "@/components/I18nProvider"

export const HowItWorks = () => {
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

