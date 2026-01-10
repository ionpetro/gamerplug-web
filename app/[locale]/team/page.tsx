'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Twitter, Instagram, Youtube, Twitch, Facebook, Code, Package, Users, Settings, Megaphone, Volume2, VolumeX } from 'lucide-react'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CharacterGrid } from '@/components/CharacterGrid'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const FBXViewer = dynamic(() => import('@/components/FBXViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/30" />
})

// Team member categories
type Role = 'Engineers' | 'Product' | 'Board' | 'Operations' | 'Marketing'

interface Character {
  id: string
  name: string
  role: Role
  class: string
  passive: { name: string; description: string }
  tactical: { name: string; description: string }
  ultimate: { name: string; description: string }
  rolePerks: string[]
  color: string
  modelPath?: string
  stats: {
    technical: number
    leadership: number
    vision: number
    execution: number
  }
}

const characters: Character[] = [
  // Engineers
  {
    id: 'ion-petropoulos',
    name: 'ION PETROPOULOS',
    role: 'Engineers',
    class: 'CO-LEAD ENG',
    passive: { name: 'AI-FIRST SYSTEMS', description: 'Created AI-first development systems' },
    tactical: { name: 'Y-COMBINATOR FINALIST', description: 'Y-Combinator AI hackathon finalist' },
    ultimate: { name: 'TECHNICAL LEADERSHIP', description: 'Expert in building scalable technical solutions' },
    rolePerks: ['AI DEVELOPMENT', 'SYSTEM ARCHITECTURE'],
    color: '#FF1053',
    modelPath: '/models/ion.fbx',
    stats: {
      technical: 95,
      leadership: 80,
      vision: 75,
      execution: 90
    }
  },
  {
    id: 'abed-hamami',
    name: 'ABED HAMAMI',
    role: 'Engineers',
    class: 'CO-LEAD ENG',
    passive: { name: 'FULL-STACK BUILDER', description: 'Built multiple apps from scratch' },
    tactical: { name: 'Y-COMBINATOR FINALIST', description: 'Y-Combinator AI hackathon finalist' },
    ultimate: { name: 'RAPID PROTOTYPING', description: 'Expert in turning ideas into working products' },
    rolePerks: ['APP DEVELOPMENT', 'TECHNICAL EXECUTION'],
    color: '#FF1053',
    modelPath: '/models/abed.fbx',
    stats: {
      technical: 95,
      leadership: 80,
      vision: 85,
      execution: 85
    }
  },
  // Product
  {
    id: 'hunter-klehm',
    name: 'HUNTER KLEHM',
    modelPath: '/models/hunter.fbx',
    role: 'Product',
    class: 'PRODUCT SME',
    passive: { name: 'GAMING EXPERTISE', description: 'Top .07% Apex Legends player' },
    tactical: { name: 'COMMUNITY FOCUS', description: 'Obsessed with gaming community' },
    ultimate: { name: 'PRODUCT INSIGHT', description: 'Deep understanding of gamer needs and preferences' },
    rolePerks: ['GAMER PERSPECTIVE', 'PRODUCT STRATEGY'],
    color: '#66C7F4',
    stats: {
      technical: 75,
      leadership: 80,
      vision: 100,
      execution: 85
    }
  },
  // Board
  {
    id: 'stephan-nicklow',
    name: 'STEPHAN NICKLOW',
    role: 'Board',
    class: 'CEO',
    passive: { name: 'META EXPERIENCE', description: 'Ex-Meta, AI consulting leader' },
    tactical: { name: 'STARTUP SUCCESS', description: 'Successful startup exits' },
    ultimate: { name: 'STRATEGIC LEADERSHIP', description: 'Expert in scaling AI and tech companies' },
    rolePerks: ['EXECUTIVE LEADERSHIP', 'BUSINESS STRATEGY'],
    color: '#6C6EA0',
    modelPath: '/models/stephan.fbx',
    stats: {
      technical: 90,
      leadership: 98,
      vision: 95,
      execution: 95
    }
  },
  {
    id: 'bill-klehm',
    name: 'BILL KLEHM',
    role: 'Board',
    class: 'CHAIRMAN',
    passive: { name: 'SERIAL ENTREPRENEUR', description: 'Multiple successful business ventures' },
    tactical: { name: 'SCALING EXPERT', description: 'Expert in scaling niche businesses' },
    ultimate: { name: 'STRATEGIC VISION', description: 'Proven track record in business growth' },
    rolePerks: ['BUSINESS DEVELOPMENT', 'STRATEGIC PLANNING'],
    color: '#6C6EA0',
    modelPath: '/models/bill.fbx',
    stats: {
      technical: 85,
      leadership: 95,
      vision: 98,
      execution: 95
    }
  },
  // Operations
  {
    id: 'billy-edwards',
    name: 'BILLY EDWARDS',
    role: 'Operations',
    class: 'TECHNOLOGIST & STRATEGIST',
    passive: { name: 'TECH TRANSFORMATION', description: 'Broad success transitioning technologies into businesses' },
    tactical: { name: 'STRATEGIC THINKING', description: 'Expert in technology strategy' },
    ultimate: { name: 'OPERATIONAL EXCELLENCE', description: 'Proven ability to execute complex initiatives' },
    rolePerks: ['TECH STRATEGY', 'OPERATIONS MANAGEMENT'],
    color: '#C1CAD6',
    modelPath: '/models/billy.fbx',
    stats: {
      technical: 95,
      leadership: 92,
      vision: 90,
      execution: 98
    }
  }
]

const roleColors: Record<Role, string> = {
  'Engineers': '#FF1053',
  'Product': '#66C7F4',
  'Board': '#6C6EA0',
  'Operations': '#C1CAD6',
  'Marketing': '#FFFFFF'
}

export default function TeamPage() {
  const pathname = usePathname()
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('billy-edwards')
  const [isMuted, setIsMuted] = useState(false)
  const isInitialMount = useRef(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const hasStartedMusic = useRef(false)

  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])

  useEffect(() => {
    const char = characters.find(c => c.id === selectedCharacterId)
    if (char) setSelectedCharacter(char)
  }, [selectedCharacterId])

  // Initialize background music
  useEffect(() => {
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio('/choose-character.mp3')
      backgroundMusicRef.current.loop = true
      backgroundMusicRef.current.volume = 0.15 // Set background music volume to 15%
      backgroundMusicRef.current.preload = 'auto'
      
      // Try to play background music (may be blocked by browser autoplay policy)
      backgroundMusicRef.current.play().then(() => {
        hasStartedMusic.current = true
      }).catch((error) => {
        console.log('Background music autoplay blocked:', error)
      })
    }

    return () => {
      // Cleanup on unmount
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current = null
      }
    }
  }, [])

  // Start music on first user interaction
  useEffect(() => {
    const startMusicOnInteraction = () => {
      if (backgroundMusicRef.current && !hasStartedMusic.current) {
        backgroundMusicRef.current.play().then(() => {
          hasStartedMusic.current = true
        }).catch((error) => {
          console.log('Failed to start music:', error)
        })
      }
    }

    // Try to start on any click
    window.addEventListener('click', startMusicOnInteraction, { once: true })
    window.addEventListener('keydown', startMusicOnInteraction, { once: true })
    window.addEventListener('touchstart', startMusicOnInteraction, { once: true })

    return () => {
      window.removeEventListener('click', startMusicOnInteraction)
      window.removeEventListener('keydown', startMusicOnInteraction)
      window.removeEventListener('touchstart', startMusicOnInteraction)
    }
  }, [])

  // Handle mute/unmute state (only for background music)
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    
    // Try to start music if it hasn't started yet
    if (backgroundMusicRef.current && !hasStartedMusic.current) {
      backgroundMusicRef.current.play().then(() => {
        hasStartedMusic.current = true
      }).catch((error) => {
        console.log('Failed to start music:', error)
      })
    }
  }

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted
    }
  }, [isMuted])

  // Play sound effect when champion changes (but not on initial mount)
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const roles: Role[] = ['Engineers', 'Product', 'Board', 'Operations', 'Marketing']
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // Navigate through categories vertically
        e.preventDefault()
        const currentRoleIndex = roles.findIndex(r => r === selectedCharacter.role)
        let newRoleIndex: number

        if (e.key === 'ArrowUp') {
          // Go to previous category, wrap around to last if at first
          newRoleIndex = currentRoleIndex === 0 ? roles.length - 1 : currentRoleIndex - 1
        } else {
          // Go to next category, wrap around to first if at last
          newRoleIndex = currentRoleIndex === roles.length - 1 ? 0 : currentRoleIndex + 1
        }

        const newRole = roles[newRoleIndex]
        const firstChar = characters.find(c => c.role === newRole)
        if (firstChar) setSelectedCharacterId(firstChar.id)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Navigate through all characters circularly
        e.preventDefault()
        const currentIndex = characters.findIndex(c => c.id === selectedCharacterId)
        let newIndex: number

        if (e.key === 'ArrowLeft') {
          // Go to previous character, wrap around to last if at first
          newIndex = currentIndex === 0 ? characters.length - 1 : currentIndex - 1
        } else {
          // Go to next character, wrap around to first if at last
          newIndex = currentIndex === characters.length - 1 ? 0 : currentIndex + 1
        }

        setSelectedCharacterId(characters[newIndex].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCharacterId, selectedCharacter.role])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      <Header />
      
      <div className="relative w-full flex-1 overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[420px] h-[420px] bg-primary/20 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-accent/25 blur-[180px] rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10"></div>
        </div>
        
        <div className="relative pt-24 pb-8 px-4 md:px-6">
        {/* Mute/Unmute Button */}
        <button
          onClick={handleMuteToggle}
          className="fixed bottom-4 right-4 md:right-8 z-50 w-10 h-10 rounded-full border border-white/20 bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Main Content */}
        <div className="container mx-auto relative mb-8">
          {/* Left Panel - Category Icons (Floating on Desktop) */}
          <div className="hidden lg:flex lg:absolute lg:left-16 lg:top-1/2 lg:-translate-y-1/2 lg:z-10 lg:flex-col lg:gap-4">
            <div className="flex flex-col gap-4">
              {[
                { role: 'Engineers' as Role, icon: Code },
                { role: 'Product' as Role, icon: Package },
                { role: 'Board' as Role, icon: Users },
                { role: 'Operations' as Role, icon: Settings },
                { role: 'Marketing' as Role, icon: Megaphone },
              ].map(({ role, icon: Icon }) => {
                const isActive = selectedCharacter.role === role
                return (
                  <button
                    key={role}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                      isActive 
                        ? 'opacity-100 scale-110' 
                        : 'opacity-50 hover:opacity-70'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${roleColors[role]}30` : 'transparent',
                      borderColor: isActive ? roleColors[role] : `${roleColors[role]}50`,
                      boxShadow: isActive ? `0 0 12px ${roleColors[role]}60` : 'none',
                    }}
                    onClick={() => {
                      // Find first character of this role
                      const firstChar = characters.find(c => c.role === role)
                      if (firstChar) setSelectedCharacterId(firstChar.id)
                    }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: roleColors[role] }} 
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Center Panel - 3D Viewport (Full Width on Desktop) */}
          <div className="w-full flex items-center justify-center">
            <div className="w-full aspect-[25/9] overflow-hidden">
              <FBXViewer
                modelPath={selectedCharacter.modelPath || "/models/ion.fbx"}
                characterId={selectedCharacter.id}
              />
            </div>
          </div>

          {/* Right Panel - Character Info (Floating on Desktop) */}
          <div className="mt-8 lg:mt-0 lg:absolute lg:right-16 lg:top-0 lg:h-full lg:flex lg:items-center lg:z-10 lg:w-80 lg:pr-8">
            <div className="space-y-6 p-6 rounded-lg w-full">
              {/* Character Name and Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-1 whitespace-nowrap">
                  {selectedCharacter.name}
                </h2>
                <p className="text-sm md:text-base text-white/70 uppercase tracking-wide whitespace-nowrap">
                  {selectedCharacter.class}
                </p>
              </div>

              {/* Stats Bars */}
              <div className="space-y-3 w-full">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Technical</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedCharacter.stats.technical}%`,
                        backgroundColor: roleColors[selectedCharacter.role],
                        transition: 'width 0.6s ease-out 0.1s, background-color 0.3s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Leadership</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedCharacter.stats.leadership}%`,
                        backgroundColor: roleColors[selectedCharacter.role],
                        transition: 'width 0.6s ease-out 0.2s, background-color 0.3s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Vision</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedCharacter.stats.vision}%`,
                        backgroundColor: roleColors[selectedCharacter.role],
                        transition: 'width 0.6s ease-out 0.3s, background-color 0.3s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Execution</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedCharacter.stats.execution}%`,
                        backgroundColor: roleColors[selectedCharacter.role],
                        transition: 'width 0.6s ease-out 0.4s, background-color 0.3s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Ability Icons Row */}
              <div className="flex gap-2">
                {[Twitter, Instagram, Youtube, Twitch, Facebook].map((Icon, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ 
                      backgroundColor: `${roleColors[selectedCharacter.role]}30`,
                      borderColor: `${roleColors[selectedCharacter.role]}50`
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: roleColors[selectedCharacter.role] }} />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section - Character Grid */}
        <div className="mt-auto">
          <div className="py-4">
            <CharacterGrid
              selectedId={selectedCharacterId}
              onSelect={(char) => setSelectedCharacterId(char.id)}
            />
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
