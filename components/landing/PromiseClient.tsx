'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export const OurPromise = () => {
  const promises = [
    {
      gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGowcWRxcjh1OGtla2sydTQ4dW41cmlkbG4yd2MxMXo2MTg4YTZpYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tczJoRU7XwBS8/giphy.gif",
      title: "no NPCs",
      description: "Every profile is monitored to keep the platform real and legit."
    },
    {
      gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2M2Y2ZkMjM1bHA0bXBpYzV5dmw0emcwOTRtemhvcndrM2NnZzlhaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xpckLTpHHRnnBS/giphy.gif",
      title: "only gamers",
      description: "No bots. No spam. Just real gamers who actually want to play."
    },
    {
      gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGg0Mzc5OXY0ZGoxMnh6MGNycG44M3Q3ZnJnZTVlNTY4bmQ0amptdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4oMoIbIQrvCjm/giphy.gif",
      title: "good vibes",
      description: "A healthy, respectful community where gaming is fun again."
    }
  ]

  return (
    <section id="our-promise" className="py-32 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none font-space-mono">
            Our <br/><span className="text-primary">Promise</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {promises.map((promise, idx) => (
            <motion.div
              key={promise.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative"
            >
              <div className="bg-card border border-border p-6 rounded-3xl h-full relative overflow-hidden">
                {/* GIF */}
                <div className="w-full aspect-video mb-4 rounded-xl overflow-hidden bg-secondary">
                  <Image
                    src={promise.gif}
                    alt={promise.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                <h3 className="text-2xl font-bold mb-2 text-foreground font-space-mono">{promise.title}</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">{promise.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

