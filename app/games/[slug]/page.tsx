'use client'

import { motion } from "framer-motion"
import { Users, MessageCircle, Trophy, Gamepad2 } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import DownloadButton from "@/components/DownloadButton"
import { Footer } from "@/components/Footer"

// Game details data structure
const gameDetails: any = {
  'battlefield-6': {
    hero: { title: 'SQUAD UP. TACTICAL PLAY.', titleHighlight: 'BATTLEFIELD.', subtitle: 'Connect with tactical players and dominate the battlefield together' },
    features: [
      { icon: Users, title: 'Squad Matching', description: 'Get matched with players based on your preferred class, playstyle, and tactical approach' },
      { icon: MessageCircle, title: 'Tactical Coordination', description: 'Built-in voice chat and messaging to coordinate squad movements and objectives' },
      { icon: Trophy, title: 'Ranked Progression', description: 'Find teammates to climb ranked mode and complete challenging objectives together' }
    ],
    howItWorks: [
      { step: '01', title: 'Select Your Class', desc: 'Choose your preferred class and playstyle - Assault, Support, Recon, or Engineer' },
      { step: '02', title: 'Match with Squad', desc: 'Our algorithm finds players who complement your tactical approach and skill level' },
      { step: '03', title: 'Deploy Together', desc: 'Join your squad, coordinate strategies, and dominate the battlefield' }
    ],
    faq: [
      { question: 'What is Battlefield 6 LFG?', answer: 'LFG (Looking for Group) helps you find squadmates for Battlefield 6 matches. Instead of playing with random players, you can connect with teammates who share your tactical approach and communication style.' },
      { question: 'How does squad matching work?', answer: 'We match you based on your preferred class, playstyle, rank, and communication preferences to create balanced squads that work well together.' }
    ]
  },
  'apex-legends': {
    hero: { title: 'Find Your', titleHighlight: 'Apex Legends', titleSuffix: 'Squad', subtitle: 'Connect with skilled Legends and dominate the Outlands together' },
    features: [
      { icon: Users, title: 'Smart Legend Matching', description: 'Get matched with players based on your main legends, rank, and playstyle preferences' },
      { icon: MessageCircle, title: 'Team Communication', description: 'Built-in voice chat and messaging to coordinate strategies and rotations' },
      { icon: Trophy, title: 'Ranked Progression', description: 'Find teammates at your skill level to climb ranked together from Bronze to Predator' }
    ],
    howItWorks: [
      { step: '01', title: 'Set Your Legend Preferences', desc: 'Tell us your main legends, preferred roles, and what rank you\'re aiming for' },
      { step: '02', title: 'Get Matched with Legends', desc: 'Our algorithm finds players who complement your squad composition and skill level' },
      { step: '03', title: 'Drop Hot Together', desc: 'Join your new squad, communicate strategies, and claim victory in the Arena' }
    ],
    faq: [
      { question: 'What is Apex Legends LFG?', answer: 'LFG (Looking for Group) helps you find teammates for Apex Legends matches. Instead of playing with random squad members, you can connect with players who share your skill level and goals.' },
      { question: 'How does legend matching work?', answer: 'Our system considers your preferred legends, playstyle, rank, and communication preferences to match you with compatible teammates who complement your squad composition.' }
    ]
  },
  'valorant': {
    hero: { title: 'Find Your', titleHighlight: 'Valorant', titleSuffix: 'Team', subtitle: 'Connect with tactical players and climb the ranks together' },
    features: [
      { icon: Users, title: 'Agent Role Matching', description: 'Find players who main complementary agents to create the perfect team composition' },
      { icon: MessageCircle, title: 'Tactical Communication', description: 'Coordinate strategies, callouts, and executions with built-in voice chat' },
      { icon: Trophy, title: 'Competitive Climbing', description: 'Team up with players at your rank to climb from Iron to Radiant together' }
    ],
    howItWorks: [
      { step: '01', title: 'Choose Your Agent Role', desc: 'Select your main agents, preferred roles (Duelist, Controller, Initiator, Sentinel)' },
      { step: '02', title: 'Match with Teammates', desc: 'Get matched with players who complement your agent pool and skill level' },
      { step: '03', title: 'Execute Perfect Strategies', desc: 'Coordinate with your team to execute flawless rounds and secure victories' }
    ],
    faq: [
      { question: 'What is Valorant LFG?', answer: 'LFG helps Valorant players find teammates instead of solo queuing. You can find players who complement your agent preferences and communication style.' },
      { question: 'How does agent matching work?', answer: 'We match you based on your agent preferences, role flexibility, communication style, and rank to create balanced team compositions.' }
    ]
  }
}

function getGameDetails(slug: string, gameName: string) {
  return gameDetails[slug] || {
    hero: { title: 'Find Your', titleHighlight: gameName, titleSuffix: 'Team', subtitle: 'Connect with skilled players and dominate together' },
    features: [
      { icon: Users, title: 'Smart Matching', description: 'Get matched with players based on your skill level and playstyle' },
      { icon: MessageCircle, title: 'Team Communication', description: 'Built-in voice chat and messaging to coordinate strategies' },
      { icon: Trophy, title: 'Competitive Play', description: 'Find teammates at your skill level to climb ranked together' }
    ],
    howItWorks: [
      { step: '01', title: 'Set Your Preferences', desc: 'Tell us your playstyle and what you\'re looking for in teammates' },
      { step: '02', title: 'Get Matched', desc: 'Our algorithm finds players who complement your style' },
      { step: '03', title: 'Play Together', desc: 'Join your new team and dominate the competition' }
    ],
    faq: [
      { question: `What is ${gameName} LFG?`, answer: `LFG helps you find teammates for ${gameName} matches instead of playing with random players.` }
    ]
  }
}

interface GamePageProps {
  params: Promise<{ slug: string }>
}

export default function GamePage({ params }: GamePageProps) {
  const [game, setGame] = useState<any>(null)
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      const { slug } = await params
      const { getGameBySlug } = await import('@/lib/games')
      const gameData = await getGameBySlug(slug)

      if (!gameData) {
        notFound()
      }

      setGame(gameData)
      setDetails(getGameDetails(slug, gameData.display_name))
    }
    loadData()
  }, [params])

  if (!game || !details) {
    return null
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-24 overflow-hidden bg-background">
        {/* Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[120px] -z-10"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-20"></div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider"
              >
                <Gamepad2 size={12} />
                LFG - Looking for Group
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
                {details.hero.titleHighlight ? (
                  <>
                    {details.hero.title.includes('.') ? (
                      details.hero.title.split('.').filter(Boolean).map((part: string, idx: number) => (
                        <span key={idx}>
                          {part.trim()}
                          <br />
                        </span>
                      ))
                    ) : (
                      <>
                        {details.hero.title}
                        <br />
                      </>
                    )}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      {details.hero.titleHighlight.toUpperCase()}
                    </span>
                    {details.hero.titleSuffix && (
                      <>
                        <br />
                        {details.hero.titleSuffix.toUpperCase()}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {details.hero.title.split(' ').slice(0, -2).join(' ')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      {details.hero.title.split(' ').slice(-2).join(' ').toUpperCase()}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-muted-foreground text-lg mb-10 max-w-lg leading-relaxed border-l-2 border-border pl-6">
                {details.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <DownloadButton />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative max-w-lg mx-auto">
                <Image
                  src={game.image || '/placeholder.svg'}
                  alt={game.display_name}
                  width={600}
                  height={800}
                  className="rounded-3xl shadow-2xl w-full h-auto"
                  style={{ objectFit: 'contain' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative bg-background overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 uppercase italic"
            >
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GamerPlug?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Discover features designed specifically for {game.display_name} players
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {details.features.map((feature: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
                  <feature.icon size={28} />
                </div>

                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-gray-300 transition-colors relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-secondary/20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
                How It <br/><span className="text-primary">Works</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md pb-2">
              Finding your {game.display_name} team has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {details.howItWorks.map((step: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative group"
              >
                <div className="bg-card border border-border p-10 rounded-3xl h-full hover:border-primary transition-colors duration-500 relative overflow-hidden">
                  <span className="absolute -bottom-4 -right-4 text-9xl font-black text-secondary/40 group-hover:text-primary/10 transition-colors select-none">
                    {step.step}
                  </span>

                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold border border-border mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                    {step.step}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 uppercase italic"
            >
              Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Questions</span>
            </motion.h2>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {details.faq.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border p-8 rounded-2xl hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-3 text-primary">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-3xl -z-10"></div>
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground uppercase italic leading-none">
                  Ready to Find Your<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{game.display_name.toUpperCase()}</span> Team?
                </h2>
                <p className="text-muted-foreground text-xl mb-10">
                  Join thousands of players who've already found their perfect teammates
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <DownloadButton />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
