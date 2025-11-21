'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Users, Zap, MessageCircle, Download, Trophy, Shield, Flame, Smartphone, Crosshair, X, Menu } from 'lucide-react'
import { Footer } from "@/components/Footer"
import WaitlistForm from "@/components/WaitlistForm"

// --- Types ---
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

// --- Components ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-background/90 backdrop-blur-md border-border py-3' : 'bg-transparent border-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-wide">GAMER<span className="text-primary">PLUG</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Community'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
            >
              {item}
            </a>
          ))}
          <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-accent transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5">
            <Download size={16} />
            Download App
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
              {['Features', 'How it Works', 'Community'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-primary font-medium py-2 border-b border-border/50 last:border-0"
                >
                  {item}
                </a>
              ))}
              <button className="w-full py-3 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-accent transition-colors">Download Now</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[120px] -z-10"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-20"></div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 pt-10 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider"
          >
            <Flame size={12} />
            The #1 Social App for Gamers
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
            SWIPE.<br />
            MATCH.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GAME ON.</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-10 max-w-lg leading-relaxed border-l-2 border-border pl-6">
            Get your ideal player plugged in.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <WaitlistForm />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-secondary relative group">
                  <img src={`https://picsum.photos/seed/${i + 100}/100/100`} alt="User" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-background bg-card flex items-center justify-center text-xs font-bold text-primary">
                +9k
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1 text-primary">
                <Users size={14} />
                <span className="font-bold text-foreground">12,405</span>
              </div>
              gamers online now
            </div>
          </div>
        </motion.div>

        {/* Phone Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.2 }}
          className="relative flex justify-center z-10"
        >
          <div className="relative w-[340px] h-[680px] bg-background border-[8px] border-secondary rounded-[3rem] shadow-2xl overflow-hidden animate-float">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-secondary rounded-b-2xl z-20"></div>

            {/* Screen Content */}
            <div className="relative w-full h-full bg-card flex flex-col">
              {/* Header */}
              <div className="h-20 bg-gradient-to-b from-black/90 to-transparent flex items-end justify-between p-5 z-10">
                <Zap size={24} className="text-primary fill-primary" />
                <div className="w-8 h-8 rounded-full bg-secondary border border-border overflow-hidden">
                  <img src="https://picsum.photos/seed/me/100/100" alt="Me" />
                </div>
              </div>

              {/* Profile Card */}
              <div className="flex-1 px-4 py-2 relative overflow-hidden">
                {/* Card Stack Effect */}
                <div className="absolute top-6 inset-x-8 h-full bg-secondary/20 rounded-3xl scale-95 -z-10"></div>
                <div className="absolute top-4 inset-x-6 h-full bg-secondary/40 rounded-3xl scale-95 -z-10"></div>

                <div className="h-[85%] w-full bg-secondary rounded-3xl overflow-hidden shadow-2xl relative group">
                  <img src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>

                  {/* Card Info */}
                  <div className="absolute bottom-0 w-full p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-3xl font-bold text-white">KAI, 22</h3>
                      <div className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">Immortal 3 Valorant player. Looking for a laid back duo or trio. No toxicity pls.</p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Valorant', 'Immortal', 'NA-West'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-md text-xs font-medium backdrop-blur-md border border-white/10 text-white">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Swipe Actions */}
                <div className="absolute bottom-4 left-0 w-full px-8 flex justify-center gap-6 items-center z-20">
                  <div className="w-14 h-14 bg-secondary/90 backdrop-blur rounded-full flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-lg cursor-pointer">
                    <X size={28} />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-110 hover:scale-125 transition-transform cursor-pointer border-4 border-background">
                    <Flame size={32} fill="white" />
                  </div>
                  <div className="w-14 h-14 bg-secondary/90 backdrop-blur rounded-full flex items-center justify-center border border-border text-muted-foreground hover:text-white hover:border-white transition-all shadow-lg cursor-pointer">
                    <MessageCircle size={28} />
                  </div>
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
              <div className="text-xs text-muted-foreground uppercase font-bold">Rank Match</div>
              <div className="text-sm font-bold text-foreground">Top 0.1% Player</div>
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
              <div className="text-xs text-muted-foreground uppercase font-bold">New Message</div>
              <div className="text-sm font-bold text-foreground">&quot;Duo for ranked?&quot;</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
      {icon}
    </div>

    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-gray-300 transition-colors relative z-10">{description}</p>
  </motion.div>
)

const Features = () => {
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
            Key Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 uppercase italic"
          >
            Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Lobby</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            We&apos;ve packed GamerPlug with everything you need to dominate the competition and find your people.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap size={28} />}
            title="AI-Powered Matching"
            description="Our algorithm analyzes KD, win rate, and playstyle to pair you with teammates who actually complement your gameplay."
            delay={0.1}
          />
          <FeatureCard
            icon={<Crosshair size={28} />}
            title="Platform Sync"
            description="Seamlessly connect your Steam, PSN, and Xbox accounts to show off your verified stats and ranks."
            delay={0.2}
          />
          <FeatureCard
            icon={<Users size={28} />}
            title="Squad Builder"
            description="Create permanent parties, organize tournament teams, or just find a 5th for a quick ranked session."
            delay={0.3}
          />
          <FeatureCard
            icon={<Shield size={28} />}
            title="Toxic-Free Zone"
            description="Community driven reputation system ensures you play with chill people. Zero tolerance for rage-quitters."
            delay={0.4}
          />
          <FeatureCard
            icon={<MessageCircle size={28} />}
            title="Low-Latency Voice"
            description="Plan your strategies before you even launch the game with our built-in high fidelity voice and text chat."
            delay={0.5}
          />
          <FeatureCard
            icon={<Trophy size={28} />}
            title="Weekly Tournaments"
            description="Join exclusive community tournaments directly through the app. Win prizes, skins, and bragging rights."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  )
}

const HowItWorks = () => {
  const steps = [
    { id: "01", title: "Create Profile", desc: "Link your stats, set your schedule, and choose your titles." },
    { id: "02", title: "Swipe & Match", desc: "Browse tailored recommendations. Swipe right to squad up." },
    { id: "03", title: "Dominate", desc: "Chat, party up, and climb the leaderboards together." }
  ]

  return (
    <section id="how-it-works" className="py-32 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
              How It <br/><span className="text-primary">Works</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md pb-2">
            Three simple steps to stop playing with randoms and start winning with a coordinated team.
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
          <span key={i} className="text-5xl md:text-6xl font-black text-secondary/30 uppercase tracking-tighter hover:text-primary transition-colors cursor-default italic">
            {game}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const CTASection = () => {
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
                Ready to join<br/>the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">SQUAD?</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-10">
                Join thousands of gamers who are matching, chatting, and winning together right now.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// --- Main Page ---

export default function GamerplugLanding() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white">
      <Header />
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
