'use client'

import { motion } from "framer-motion"
import { Mail, MessageCircle, Flame } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/Footer"
import { I18nProvider } from "@/components/I18nProvider"
import { useEffect, useState } from "react"

export default function ContactPage() {
  const [messages, setMessages] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { loadMessages } = await import('@/lib/i18n')
      const msgs = await loadMessages('en')
      setMessages(msgs)
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading) return null

  return (
    <I18nProvider locale="en" messages={messages}>
      <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-24 overflow-hidden bg-background">
        {/* Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[120px] -z-10"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-20"></div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-wider"
            >
              <MessageCircle size={12} />
              Get In Touch
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
              CONTACT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">US.</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Have questions about Gamerplug? Need support? We're here to help you connect with the gaming community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-20 px-4 relative bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* WhatsApp Support */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">Talk to the Founders</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10">
                Need help with your account, have a question, or want to report an issue? Message us on WhatsApp and we'll get back to you ASAP.
              </p>
              <a
                href="https://wa.me/306988617790"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5 relative z-10"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                +30 6988617790
              </a>
            </motion.div>

            {/* Twitter/X */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">Follow Us on X</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10">
                Stay updated with the latest news, features, and community highlights. Follow us for real-time updates and gaming tips.
              </p>
              <Link
                href="https://x.com/The_Gamer_Plug"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5 relative z-10"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @The_Gamer_Plug
              </Link>
            </motion.div>

            {/* TikTok */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">Watch Us on TikTok</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10">
                Check out our gaming content, community highlights, and behind-the-scenes updates on TikTok.
              </p>
              <Link
                href="https://www.tiktok.com/@thegamerplugapp?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5 relative z-10"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                @thegamerplugapp
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-secondary/20 relative overflow-hidden">
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
            {[
              {
                question: "When will Gamerplug be available?",
                answer: "Gamerplug is currently in development. Join our waitlist to be the first to know when we launch!"
              },
              {
                question: "Which platforms will Gamerplug support?",
                answer: "Gamerplug will be available on iOS and Android, with support for cross-platform gaming communities including PC, PlayStation, Xbox, and Nintendo Switch."
              },
              {
                question: "How do I report a bug or issue?",
                answer: "Message us on WhatsApp at +30 6988617790 with details about the issue you're experiencing, and we'll investigate it promptly."
              },
              {
                question: "Can I suggest new features?",
                answer: "Absolutely! We love hearing from our community. Message us on WhatsApp with your feature suggestions or reach out on Twitter."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border p-8 rounded-2xl hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-3 text-primary">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </I18nProvider>
  )
}
