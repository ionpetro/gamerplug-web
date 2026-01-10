'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Plus, Flag, Sword, Zap, Eye, Target, Volume2, VolumeX } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CharacterGrid } from '@/components/CharacterGrid'
import { BottomActions } from '@/components/BottomActions'
import dynamic from 'next/dynamic'

const FBXViewer = dynamic(() => import('@/components/FBXViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/30" />
})

// Team member categories
type Role = 'Engineers' | 'Product' | 'Board' | 'Operations' | 'Streamers'

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
}

const characters: Character[] = [
  {
    id: 'lifeline',
    name: 'LIFELINE',
    role: 'Operations',
    class: 'COMBAT MEDIC',
    passive: { name: 'COMBAT REVIVE', description: 'Automatically revive downed teammates while protected by a shield' },
    tactical: { name: 'D.O.C HEAL DRONE', description: 'Deploy a drone that heals nearby teammates over time' },
    ultimate: { name: 'CARE PACKAGE', description: 'Call in a care package with high-tier defensive gear' },
    rolePerks: ['ACCESS EXTENDED SUPPLY BINS', 'CRAFT ALLY BANNERS'],
    color: '#467599'
  },
  {
    id: 'wraith',
    name: 'WRAITH',
    role: 'Product',
    class: 'INTERDIMENSIONAL SKIRMISHER',
    passive: { name: 'VOICES FROM THE VOID', description: 'A voice warns you when danger approaches' },
    tactical: { name: 'INTO THE VOID', description: 'Reposition quickly through the safety of void space' },
    ultimate: { name: 'DIMENSIONAL RIFT', description: 'Link two locations with portals for 60 seconds' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#9ED8DB'
  },
  {
    id: 'bloodhound',
    name: 'BLOODHOUND',
    role: 'Board',
    class: 'TECHNOLOGICAL TRACKER',
    passive: { name: 'TRACKER', description: 'See tracks left behind by your foes' },
    tactical: { name: 'EYE OF THE ALLFATHER', description: 'Briefly reveal hidden enemies, traps, and clues' },
    ultimate: { name: 'BEAST OF THE HUNT', description: 'Transform into the ultimate hunter' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#1D3354'
  },
  {
    id: 'gibraltar',
    name: 'GIBRALTAR',
    role: 'Operations',
    class: 'SHIELDED FORTRESS',
    passive: { name: 'GUN SHIELD', description: 'Aiming down sights deploys a gun shield that blocks incoming fire' },
    tactical: { name: 'DOME OF PROTECTION', description: 'Throw down a dome shield that blocks attacks' },
    ultimate: { name: 'DEFENSIVE BOMBARDMENT', description: 'Call in a concentrated mortar strike' },
    rolePerks: ['ACCESS EXTENDED SUPPLY BINS', 'CRAFT ALLY BANNERS'],
    color: '#467599'
  },
  {
    id: 'pathfinder',
    name: 'PATHFINDER',
    role: 'Board',
    class: 'FORWARD SCOUT',
    passive: { name: 'INSIDER KNOWLEDGE', description: 'Scan a survey beacon to reduce the ultimate cooldown' },
    tactical: { name: 'GRAPPLING HOOK', description: 'Grapple to get to out-of-reach places quickly' },
    ultimate: { name: 'ZIPLINE GUN', description: 'Create a zipline for everyone to use' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#1D3354'
  },
  {
    id: 'bangalore',
    name: 'BANGALORE',
    role: 'Engineers',
    class: 'PROFESSIONAL SOLDIER',
    passive: { name: 'DOUBLE TIME', description: 'Taking fire while sprinting makes you move faster' },
    tactical: { name: 'SMOKE LAUNCHER', description: 'Fire a high-velocity smoke canister that explodes into a smoke wall' },
    ultimate: { name: 'ROLLING THUNDER', description: 'Call in an artillery strike that slowly creeps across the landscape' },
    rolePerks: ['EXTENDED SUPPLY BINS', 'SMALL STACK'],
    color: '#D64045'
  },
  {
    id: 'caustic',
    name: 'CAUSTIC',
    role: 'Streamers',
    class: 'TOXIC TRAPPER',
    passive: { name: 'NOX VISION', description: 'You gain threat vision on enemies moving through your gas' },
    tactical: { name: 'NOX GAS TRAP', description: 'Place up to 6 canisters that release deadly Nox gas when shot or triggered' },
    ultimate: { name: 'NOX GAS GRENADE', description: 'Blanket a large area in Nox gas' },
    rolePerks: ['RING CONSOLE', 'CARE PACKAGE INSIGHT'],
    color: '#E9FFF9'
  },
  {
    id: 'mirage',
    name: 'MIRAGE',
    role: 'Operations',
    class: 'HOBBYIST ILLUSIONIST',
    passive: { name: 'NOW YOU SEE ME...', description: 'Automatically cloak when using Respawn Beacons and reviving teammates' },
    tactical: { name: 'PSYCHE OUT', description: 'Send out a holographic decoy to confuse the enemy' },
    ultimate: { name: 'LIFE OF THE PARTY', description: 'Deploy a team of controllable decoys to distract enemies' },
    rolePerks: ['ACCESS EXTENDED SUPPLY BINS', 'CRAFT ALLY BANNERS'],
    color: '#467599'
  },
  {
    id: 'octane',
    name: 'OCTANE',
    role: 'Product',
    class: 'HIGH-SPEED DAREDEVIL',
    passive: { name: 'SWIFT MEND', description: 'Automatically restores health over time' },
    tactical: { name: 'STIM', description: 'Move 30% faster for 6 seconds. Costs health to use' },
    ultimate: { name: 'LAUNCH PAD', description: 'Deploy a jump pad that launches teammates through the air' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#9ED8DB'
  },
  {
    id: 'wattson',
    name: 'WATTSON',
    role: 'Streamers',
    class: 'STATIC DEFENDER',
    passive: { name: 'SPARK OF GENIUS', description: 'Ultimate Accelerants fully charge your ultimate' },
    tactical: { name: 'PERIMETER SECURITY', description: 'Create electrified fences that damage and slow enemies' },
    ultimate: { name: 'INTERCEPTION PYLON', description: 'Place an electrified pylon that destroys incoming ordnance' },
    rolePerks: ['RING CONSOLE', 'CARE PACKAGE INSIGHT'],
    color: '#E9FFF9'
  },
  {
    id: 'crypto',
    name: 'CRYPTO',
    role: 'Board',
    class: 'SURVEILLANCE EXPERT',
    passive: { name: 'NEUROLINK', description: 'Teammates see what your Surveillance Drone detects' },
    tactical: { name: 'SURVEILLANCE DRONE', description: 'Deploy an aerial camera drone' },
    ultimate: { name: 'DRONE EMP', description: 'Charge your drone to blast nearby enemies' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#1D3354'
  },
  {
    id: 'revenant',
    name: 'REVENANT',
    role: 'Engineers',
    class: 'SYNDICATE ASSASSIN',
    passive: { name: 'STALKER', description: 'You crouch-walk faster and can climb higher' },
    tactical: { name: 'SILENCE', description: 'Throw a device that damages and disables enemy abilities' },
    ultimate: { name: 'DEATH TOTEM', description: 'Drop a totem that protects you from death' },
    rolePerks: ['EXTENDED SUPPLY BINS', 'SMALL STACK'],
    color: '#D64045'
  },
  {
    id: 'loba',
    name: 'LOBA',
    role: 'Operations',
    class: 'HIGH-SOCIETY THIEF',
    passive: { name: 'EYE FOR QUALITY', description: 'See epic and legendary loot through walls' },
    tactical: { name: 'BURGLAR\'S BEST FRIEND', description: 'Teleport to hard-to-reach places or escape trouble' },
    ultimate: { name: 'BLACK MARKET BOUTIQUE', description: 'Place a device that allows you to teleport nearby loot' },
    rolePerks: ['ACCESS EXTENDED SUPPLY BINS', 'CRAFT ALLY BANNERS'],
    color: '#467599'
  },
  {
    id: 'rampart',
    name: 'RAMPART',
    role: 'Streamers',
    class: 'MODDED LOADER',
    passive: { name: 'MODDED LOADER', description: 'Increased magazine capacity and faster reloads' },
    tactical: { name: 'AMPED COVER', description: 'Build a crouch-cover wall that deploys a full-cover amped wall' },
    ultimate: { name: 'EMPLACED MINIGUN "SHEILA"', description: 'Wield a mounted machine gun' },
    rolePerks: ['RING CONSOLE', 'CARE PACKAGE INSIGHT'],
    color: '#E9FFF9'
  },
  {
    id: 'horizon',
    name: 'HORIZON',
    role: 'Product',
    class: 'GRAVITATIONAL MANIPULATOR',
    passive: { name: 'SPACEWALK', description: 'Increase air control and reduce fall impacts' },
    tactical: { name: 'GRAVITY LIFT', description: 'Create a lift that launches players upward' },
    ultimate: { name: 'BLACK HOLE', description: 'Deploy N.E.W.T. to create a micro black hole' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#9ED8DB'
  },
  {
    id: 'fuse',
    name: 'FUSE',
    role: 'Engineers',
    class: 'EXPLOSIVES EXPERT',
    passive: { name: 'GRENADIER', description: 'Stack an extra grenade per inventory slot' },
    tactical: { name: 'KNUCKLE CLUSTER', description: 'Launch a cluster bomb that continuously expels airburst explosives' },
    ultimate: { name: 'THE MOTHERLODE', description: 'Launch a bombardment that encircles a target in a wall of flame' },
    rolePerks: ['EXTENDED SUPPLY BINS', 'SMALL STACK'],
    color: '#D64045'
  },
  {
    id: 'valkyrie',
    name: 'VALKYRIE',
    role: 'Product',
    class: 'WINGED AVENGER',
    passive: { name: 'VTOL JETS', description: 'Use jetpack to fly' },
    tactical: { name: 'MISSILE SWARM', description: 'Fire a swarm of mini-rockets that damage and disorient the enemy' },
    ultimate: { name: 'SKYWARD DIVE', description: 'Launch into the air and redeploy' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#9ED8DB'
  },
  {
    id: 'seer',
    name: 'SEER',
    role: 'Board',
    class: 'AMBUSH ARTIST',
    passive: { name: 'HEARTSEEKER', description: 'Hear and visualize the heartbeats of enemies within 75m' },
    tactical: { name: 'FOCUS OF ATTENTION', description: 'Summon micro-drones to reveal and interrupt enemies' },
    ultimate: { name: 'EXHIBIT', description: 'Create a sphere that reveals enemies moving quickly' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#1D3354'
  },
  {
    id: 'ash',
    name: 'ASH',
    role: 'Engineers',
    class: 'INCISIVE INSTIGATOR',
    passive: { name: 'MARKED FOR DEATH', description: 'Damaging enemies marks their deathboxes on the map' },
    tactical: { name: 'ARC SNARE', description: 'Throw a spinning snare that damages and tethers enemies' },
    ultimate: { name: 'PHASE BREACH', description: 'Tear open a one-way portal to a targeted location' },
    rolePerks: ['EXTENDED SUPPLY BINS', 'SMALL STACK'],
    color: '#D64045'
  },
  {
    id: 'mad-maggie',
    name: 'MAD MAGGIE',
    role: 'Engineers',
    class: 'REBEL WARLORD',
    passive: { name: 'WRECKER', description: 'Highlight enemies you\'ve damaged' },
    tactical: { name: 'RIOT DRILL', description: 'Fire a drill that attaches to an enemy and burns them' },
    ultimate: { name: 'WRECKING BALL', description: 'Throw a ball that releases speed-boosting pads and detonates near enemies' },
    rolePerks: ['EXTENDED SUPPLY BINS', 'SMALL STACK'],
    color: '#D64045'
  },
  {
    id: 'newcastle',
    name: 'NEWCASTLE',
    role: 'Operations',
    class: 'HEROIC DEFENDER',
    passive: { name: 'RETRIEVE THE WOUNDED', description: 'Drag downed allies while reviving and protecting them with your Revive Shield' },
    tactical: { name: 'MOBILE SHIELD', description: 'Throw a controllable drone that creates a moving energy shield' },
    ultimate: { name: 'CASTLE WALL', description: 'Leap to an ally or target area and slam down, creating a fortified stronghold' },
    rolePerks: ['ACCESS EXTENDED SUPPLY BINS', 'CRAFT ALLY BANNERS'],
    color: '#467599'
  },
  {
    id: 'vantage',
    name: 'VANTAGE',
    role: 'Board',
    class: 'SURVIVALIST SNIPER',
    passive: { name: 'SPOTTER\'S LENS', description: 'Aiming down sights of a sniper rifle marks enemies' },
    tactical: { name: 'ECHO RELOCATION', description: 'Send out Echo to a location and launch toward him' },
    ultimate: { name: 'SNIPER\'S MARK', description: 'Fire a bullet that marks targets for increased damage' },
    rolePerks: ['SURVEY BEACONS', 'CARE PACKAGE INSIGHT'],
    color: '#1D3354'
  },
  {
    id: 'catalyst',
    name: 'CATALYST',
    role: 'Streamers',
    class: 'DEFENSIVE CONJURER',
    passive: { name: 'BARRIER RECHARGE', description: 'Standing near your Reinforcements and Barricades restores their health' },
    tactical: { name: 'PIERCING SPIKES', description: 'Throw out a patch of ferrofluid that turns into spikes when enemies are near' },
    ultimate: { name: 'DARK VEIL', description: 'Raise a permeable wall of ferrofluid that blocks vision and slows enemies' },
    rolePerks: ['RING CONSOLE', 'CARE PACKAGE INSIGHT'],
    color: '#E9FFF9'
  },
  {
    id: 'ballistic',
    name: 'BALLISTIC',
    role: 'Engineers',
    class: 'WEAPONS ARTIST',
    passive: { name: 'GUNSLINGER', description: 'Carry a third weapon' },
    tactical: { name: 'WHISTLER', description: 'Shoot a projectile that heats up an enemy\'s weapon' },
    ultimate: { name: 'TEMPERED PLATING', description: 'Grants infinite ammo and faster reloads' },
    rolePerks: ['EXTENDED SUPPLY BINS', 'SMALL STACK'],
    color: '#D64045'
  },
  {
    id: 'conduit',
    name: 'CONDUIT',
    role: 'Operations',
    class: 'ENERGY JOCKEY',
    passive: { name: 'SAVED BY THE BELL', description: 'Temporarily regenerate shields when out of combat' },
    tactical: { name: 'RADIANT TRANSFER', description: 'Transfer shields to teammates' },
    ultimate: { name: 'ENERGY BARricade', description: 'Deploy energy jammers that damage and slow enemies' },
    rolePerks: ['ACCESS EXTENDED SUPPLY BINS', 'CRAFT ALLY BANNERS'],
    color: '#467599'
  }
]

const roleColors: Record<Role, string> = {
  'Engineers': '#D64045',
  'Product': '#9ED8DB',
  'Board': '#1D3354',
  'Operations': '#467599',
  'Streamers': '#E9FFF9'
}

const roleIcons: Record<Role, typeof Sword> = {
  'Engineers': Sword,
  'Product': Zap,
  'Board': Eye,
  'Operations': Shield,
  'Streamers': Target
}

const roleDescriptions: Record<Role, string> = {
  'Engineers': 'TEAM ENGINEERING & DEVELOPMENT',
  'Product': 'TEAM PRODUCT & DESIGN',
  'Board': 'TEAM LEADERSHIP & STRATEGY',
  'Operations': 'TEAM OPERATIONS & SUPPORT',
  'Streamers': 'TEAM CONTENT & STREAMING'
}

// Map team member IDs to their 3D models
const teamMemberModels: Record<string, { modelPath: string; texturePath: string }> = {
  'ion-petropoulos': { modelPath: '/models/ion.fbx', texturePath: '/models/ion_texture.png' },
  'abed-hamami': { modelPath: '/models/abed.fbx', texturePath: '/models/abed_texture.png' },
  'hunter-klehm': { modelPath: '/models/hunter.fbx', texturePath: '/models/hunter_texture.png' },
  'stephan-nicklow': { modelPath: '/models/stephan.fbx', texturePath: '/models/stephan_texture.png' },
  'bill-klehm': { modelPath: '/models/bill.fbx', texturePath: '/models/bill_texture.png' },
  'billy-edwards': { modelPath: '/models/billy.fbx', texturePath: '/models/billy_texture.png' },
}

export default function TeamPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('stephan-nicklow')
  const [isMuted, setIsMuted] = useState(false)
  const isInitialMount = useRef(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const hasStartedMusic = useRef(false)

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
      
      <div className="pt-24 pb-8 px-4 md:px-6">
        {/* Main Content */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Panel - Character Info */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3 uppercase tracking-tight">
                {selectedCharacter.name}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-bold uppercase mb-8 tracking-wide">
                {selectedCharacter.class}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6" style={{ color: selectedCharacter.color }} />
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest font-space-mono">PASSIVE</span>
                </div>
                <p className="text-white font-bold text-base md:text-lg font-space-mono tracking-wide leading-relaxed pl-9">
                  {selectedCharacter.passive.name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selectedCharacter.color }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCharacter.color }}></div>
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest font-space-mono">TACTICAL</span>
                </div>
                <p className="text-white font-bold text-base md:text-lg font-space-mono tracking-wide leading-relaxed pl-9">
                  {selectedCharacter.tactical.name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 border-2 flex items-center justify-center" style={{ borderColor: selectedCharacter.color }}>
                    <div className="w-3 h-3" style={{ backgroundColor: selectedCharacter.color }}></div>
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest font-space-mono">ULTIMATE</span>
                </div>
                <p className="text-white font-bold text-base md:text-lg font-space-mono tracking-wide leading-relaxed pl-9">
                  {selectedCharacter.ultimate.name}
                </p>
              </div>
            </div>
          </div>

          {/* Center Panel - 3D Viewport */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full aspect-[4/3] border-2 border-border rounded-lg bg-card/50 overflow-hidden">
              <FBXViewer
                modelPath={teamMemberModels[selectedCharacterId]?.modelPath || '/models/stephan.fbx'}
                texturePath={teamMemberModels[selectedCharacterId]?.texturePath || '/models/stephan_texture.png'}
                characterId={selectedCharacterId}
              />
            </div>
          </div>

          {/* Right Panel - Role Info */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  {selectedCharacter.role}
                </h2>
                <Shield className="w-14 h-14" style={{ color: roleColors[selectedCharacter.role] }} />
              </div>
              <p className="text-lg md:text-xl text-primary font-bold uppercase mb-8 tracking-wide font-space-mono">
                {roleDescriptions[selectedCharacter.role]}
              </p>
            </div>

            <div className="space-y-4">
              {selectedCharacter.rolePerks.map((perk, index) => (
                <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-card/30 border border-border/50 hover:border-primary/50 transition-colors">
                  <span className="text-white text-sm md:text-base font-space-mono tracking-wide flex-1">{perk}</span>
                  {index === 0 ? (
                    <Plus className="w-5 h-5 flex-shrink-0" style={{ color: selectedCharacter.color }} />
                  ) : (
                    <Flag className="w-5 h-5 flex-shrink-0" style={{ color: '#00FF00' }} />
                  )}
                </div>
              ))}
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
          <BottomActions />
        </div>
      </div>

      <Footer />
    </div>
  )
}

