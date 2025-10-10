"use client";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Users, Zap, Trophy } from "lucide-react";
import DownloadButton from "@/components/DownloadButton";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/components/I18nProvider";

export default function LocalizedHome() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-red-900/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              🎮 {t.home.badge}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent leading-tight">
              Gamerplug
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-muted-foreground max-w-2xl mx-auto">
              {t.home.subtitle}
            </p>
            <p className="text-lg mb-8 text-muted-foreground max-w-3xl mx-auto">
              {t.home.lead}
            </p>
            <DownloadButton />
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Gamepad2 className="h-8 w-8 text-primary/60" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Trophy className="h-6 w-6 text-accent/60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-700">
          <Zap className="h-7 w-7 text-primary/40" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.home.featuresTitle}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.home.featuresSub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group rounded-xl border">
              <div className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t.home.feature1}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.home.feature1Desc}
                </p>
              </div>
            </div>

            <div className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group rounded-xl border">
              <div className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Gamepad2 className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t.home.feature2}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.home.feature2Desc}
                </p>
              </div>
            </div>

            <div className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group rounded-xl border">
              <div className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t.home.feature3}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.home.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.home.howTitle}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.home.howSub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.home.how1Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.home.how1Desc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.home.how2Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.home.how2Desc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.home.how3Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.home.how3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-red-900/30" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">{t.home.ctaTitle}</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              {t.home.ctaSub}
            </p>
            <DownloadButton />
            <p className="text-sm text-muted-foreground mt-6">{t.home.ctaFoot}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}



