'use client'

import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  comingSoon?: boolean
}

export const FeatureCard = ({ icon, title, description, delay, comingSoon }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-default relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {comingSoon && (
      <div className="absolute top-4 right-4 z-20">
        <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded border border-primary uppercase tracking-wide">
          Coming Soon
        </span>
      </div>
    )}

    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border group-hover:border-primary shadow-lg relative z-10 text-primary">
      {icon}
    </div>

    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors relative z-10">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-gray-300 transition-colors relative z-10">{description}</p>
  </motion.div>
)

