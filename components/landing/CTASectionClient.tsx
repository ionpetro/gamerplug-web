'use client'

import DownloadButton from "@/components/DownloadButton"
import { useI18n } from "@/components/I18nProvider"

export const CTASection = () => {
  const { t } = useI18n()

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="relative rounded-[2.5rem] overflow-hidden">
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
              <div className="flex justify-center">
                <DownloadButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
