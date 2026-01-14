'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DollarSign, TrendingUp, Sparkles, Video, Shield, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />

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
              Affiliate Program
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-6">
              Partner with <span className="text-primary">GamerPlug</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Join our squad. Monetize your influence. Help us cure gaming loneliness.
            </p>
            <Link
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200"
            >
              Apply Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Compensation Package Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Compensation Package</h2>
            <p className="text-muted-foreground text-lg">A transparent, performance-driven partnership model.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Base Retainer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <DollarSign className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 relative z-10">1. Base Retainer</p>
              <h3 className="text-4xl font-black text-primary mb-3 relative z-10">$100<span className="text-lg text-muted-foreground font-normal"> / month</span></h3>
              <p className="text-muted-foreground text-sm relative z-10">Guaranteed monthly payment as long as posting requirements are met.</p>
            </motion.div>

            {/* Performance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <TrendingUp className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 relative z-10">2. Performance</p>
              <h3 className="text-4xl font-black text-primary mb-3 relative z-10">$1.00<span className="text-lg text-muted-foreground font-normal"> / signup</span></h3>
              <p className="text-muted-foreground text-sm relative z-10">Earn for every verified signup through your unique referral link.</p>
            </motion.div>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <Sparkles className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 relative z-10">3. Summary</p>
              <h3 className="text-xl font-bold mb-3 relative z-10">Earnings Model</h3>
              <ul className="text-muted-foreground text-sm space-y-2 relative z-10">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-white">$100 Monthly Base:</strong> Consistent income for consistent content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-white">$1 Per Signup:</strong> Direct reward for your influence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-white">Unlimited Potential:</strong> No caps on earnings.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Application Form */}
          <motion.div
            id="apply"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl md:text-3xl font-black uppercase mb-4">Apply Now</h3>
            <p className="text-muted-foreground mb-8">Fill out the form below to join our affiliate program.</p>
            <div className="w-full">
              <iframe
                src="https://tally.so/embed/kdGWZZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                width="100%"
                height="900"
                frameBorder="0"
                title="GamerPlug Affiliate Application"
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
                What is <span className="text-primary">GamerPlug</span>?
              </h2>
              <p className="text-muted-foreground text-sm uppercase tracking-wide mb-4">The product you will be promoting.</p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                GamerPlug is a swipe-based social platform designed to foster meaningful relationships for gamers worldwide. Founded in September 2025 and based in Austin, Texas, GamerPlug serves as a &quot;borderless connector,&quot; helping moderate to serious gamers find their squad in a bot-free environment.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Unlike traditional platforms, GamerPlug users upload gameplay clips instead of static profile pictures, allowing the community to connect based on playstyle and skill. With a focus on safety and reducing friction, the platform solves the growing problem of loneliness in the gaming community.
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
                  alt="GamerPlug App Interface"
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
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Why Your Audience Will Care</h2>
            <p className="text-muted-foreground text-lg">Key selling points for your content.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Clip-First Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <Video className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Clip-First Profiles</h3>
              <p className="text-muted-foreground text-sm relative z-10">No catfish or bots. Users match based on actual gameplay video clips, ensuring skill and vibe compatibility.</p>
            </motion.div>

            {/* Safety & Integrity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <Shield className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Safety & Integrity</h3>
              <p className="text-muted-foreground text-sm relative z-10">A prioritized organized environment that eliminates the friction of finding a new community.</p>
            </motion.div>

            {/* Future Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <Calendar className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Future Features</h3>
              <p className="text-muted-foreground text-sm relative z-10">&quot;Looking for Groups&quot; (LFG) scheduling and &quot;Game Now&quot; for instant lobbies.</p>
            </motion.div>

            {/* Low Cost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-border relative z-10">
                <Tag className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Low Cost</h3>
              <p className="text-muted-foreground text-sm relative z-10">Premium subscription is just $4.99/mo (cheaper than a Twitch sub).</p>
            </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">The Team</h2>
            <p className="text-muted-foreground text-lg">Who you&apos;ll be working with.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Stephanos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                <Image
                  src="/models/thumbnails/stephan.png"
                  alt="Stephanos"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 relative z-10">Stephanos</h3>
              <p className="text-primary font-medium text-sm mb-4 relative z-10">CEO</p>
              <p className="text-muted-foreground text-sm relative z-10">The vision carrier. Stephanos focuses on keeping the team vibe high and leading strategic user acquisition.</p>
            </motion.div>

            {/* Hunter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                <Image
                  src="/models/thumbnails/hunter.png"
                  alt="Hunter"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 relative z-10">Hunter</h3>
              <p className="text-primary font-medium text-sm mb-4 relative z-10">CVO</p>
              <p className="text-muted-foreground text-sm relative z-10">Chief Visionary Officer. Hunter works to strengthen the community connection and product roadmap.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
