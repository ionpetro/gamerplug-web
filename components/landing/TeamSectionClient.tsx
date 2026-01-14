'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CharacterGrid } from '@/components/CharacterGrid'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'

const FBXViewer = dynamic(() => import('@/components/FBXViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/30 rounded-full animate-pulse" />
})

// Map team member IDs to their 3D models
const teamMemberModels: Record<string, string> = {
  'ion-petropoulos': '/models/ion.fbx',
  'abed-hamami': '/models/abed.fbx',
  'hunter-klehm': '/models/hunter.fbx',
  'stephan-nicklow': '/models/stephan.fbx',
  'bill-klehm': '/models/bill.fbx',
  'billy-edwards': '/models/billy.fbx',
}

// All team member IDs in order
const teamMemberIds = [
  'ion-petropoulos',
  'abed-hamami',
  'hunter-klehm',
  'bill-klehm',
  'billy-edwards',
  'stephan-nicklow',
]

export function TeamSection() {
  const [selectedCharacterId, setSelectedCharacterId] = useState('stephan-nicklow')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isInitialMount = useRef(true)

  // Play sound effect when character changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/0110.MP3')
      audioRef.current.volume = 0.5 // Set volume to 50%
    }

    // Play the sound
    audioRef.current.currentTime = 0 // Reset to start
    audioRef.current.play().catch((error) => {
      // Handle autoplay restrictions (browsers may block autoplay)
      console.log('Audio play failed:', error)
    })
  }, [selectedCharacterId])

  const handlePrevious = () => {
    const currentIndex = teamMemberIds.indexOf(selectedCharacterId)
    const newIndex = currentIndex === 0 ? teamMemberIds.length - 1 : currentIndex - 1
    setSelectedCharacterId(teamMemberIds[newIndex])
  }

  const handleNext = () => {
    const currentIndex = teamMemberIds.indexOf(selectedCharacterId)
    const newIndex = currentIndex === teamMemberIds.length - 1 ? 0 : currentIndex + 1
    setSelectedCharacterId(teamMemberIds[newIndex])
  }

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Meet The Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 uppercase italic"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Squad</span> Behind GamerPlug
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            A diverse team of gamers, engineers, and entrepreneurs united by one mission: revolutionizing how gamers connect.
          </motion.p>
        </div>

        {/* 3D Model Viewer with Navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-12 flex justify-center items-center gap-8"
        >
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            className="w-12 h-12 rounded-full border-2 border-white/30 bg-gradient-to-b from-white/10 to-black/40 hover:from-white/20 hover:to-black/50 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm shadow-lg"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-6 h-6 text-white" strokeWidth={3} />
          </button>

          {/* 3D Model */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-card/50 cursor-pointer">
            <FBXViewer
              modelPath={teamMemberModels[selectedCharacterId] || '/models/stephan.fbx'}
              characterId={selectedCharacterId}
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border-2 border-white/30 bg-gradient-to-b from-white/10 to-black/40 hover:from-white/20 hover:to-black/50 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm shadow-lg"
            aria-label="Next team member"
          >
            <ChevronRight className="w-6 h-6 text-white" strokeWidth={3} />
          </button>
        </motion.div>

        {/* Character Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-8"
        >
          <CharacterGrid
            selectedId={selectedCharacterId}
            onSelect={(char) => setSelectedCharacterId(char.id)}
          />

          {/* Visit Team Page Link */}
          <a
            href="/en/team"
            className="text-white hover:text-primary transition-colors duration-300 font-semibold uppercase tracking-wide text-xs underline underline-offset-4 pt-8 flex items-center gap-1"
          >
            Choose Your Character
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
