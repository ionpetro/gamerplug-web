import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Star, Trophy, Gamepad2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllGames, getGameBySlug } from "@/lib/games"
import WaitlistForm from "@/components/WaitlistForm"

// Game data with detailed information for each game
const games = {
  'apex-legends': {
    id: 'apex-legends',
    name: 'Apex Legends',
    displayName: 'Apex Legends',
    slug: 'apex-legends',
    color: '#FF3B30',
    image: '/images/games/apex.webp',
    hero: {
      title: 'Find Your Apex Legends Squad',
      subtitle: 'Connect with skilled Legends and dominate the Outlands together',
    },
    features: [
      {
        icon: Users,
        title: 'Smart Legend Matching',
        description: 'Get matched with players based on your main legends, rank, and playstyle preferences'
      },
      {
        icon: MessageCircle,
        title: 'Team Communication',
        description: 'Built-in voice chat and messaging to coordinate strategies and rotations'
      },
      {
        icon: Trophy,
        title: 'Ranked Progression',
        description: 'Find teammates at your skill level to climb ranked together from Bronze to Predator'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Set Your Legend Preferences',
        description: 'Tell us your main legends, preferred roles, and what rank you\'re aiming for'
      },
      {
        step: '2',
        title: 'Get Matched with Legends',
        description: 'Our algorithm finds players who complement your squad composition and skill level'
      },
      {
        step: '3',
        title: 'Drop Hot Together',
        description: 'Join your new squad, communicate strategies, and claim victory in the Arena'
      }
    ],
    faq: [
      {
        question: 'What is Apex Legends LFG?',
        answer: 'LFG (Looking for Group) helps you find teammates for Apex Legends matches. Instead of playing with random squad members, you can connect with players who share your skill level and goals.'
      },
      {
        question: 'How does legend matching work?',
        answer: 'Our system considers your preferred legends, playstyle, rank, and communication preferences to match you with compatible teammates who complement your squad composition.'
      }
    ]
  },
  'valorant': {
    id: 'valorant',
    name: 'Valorant',
    displayName: 'Valorant',
    slug: 'valorant',
    color: '#FF4655',
    image: '/images/games/valorant.webp',
    hero: {
      title: 'Find Your Valorant Team',
      subtitle: 'Connect with tactical players and climb the ranks together',
    },
    features: [
      {
        icon: Users,
        title: 'Agent Role Matching',
        description: 'Find players who main complementary agents to create the perfect team composition'
      },
      {
        icon: MessageCircle,
        title: 'Tactical Communication',
        description: 'Coordinate strategies, callouts, and executions with built-in voice chat'
      },
      {
        icon: Trophy,
        title: 'Competitive Climbing',
        description: 'Team up with players at your rank to climb from Iron to Radiant together'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Choose Your Agent Role',
        description: 'Select your main agents, preferred roles (Duelist, Controller, Initiator, Sentinel)'
      },
      {
        step: '2',
        title: 'Match with Teammates',
        description: 'Get matched with players who complement your agent pool and skill level'
      },
      {
        step: '3',
        title: 'Execute Perfect Strategies',
        description: 'Coordinate with your team to execute flawless rounds and secure victories'
      }
    ],
    faq: [
      {
        question: 'What is Valorant LFG?',
        answer: 'LFG helps Valorant players find teammates instead of solo queuing. You can find players who complement your agent preferences and communication style.'
      },
      {
        question: 'How does agent matching work?',
        answer: 'We match you based on your agent preferences, role flexibility, communication style, and rank to create balanced team compositions.'
      }
    ]
  },
  'league-of-legends': {
    id: 'league-of-legends',
    name: 'League of Legends',
    displayName: 'League of Legends',
    slug: 'league-of-legends',
    color: '#FFD700',
    image: '/images/games/lol.webp',
    hero: {
      title: 'Find Your League of Legends Team',
      subtitle: 'Connect with skilled summoners and dominate the Rift',
    },
    features: [
      {
        icon: Users,
        title: 'Role & Champion Matching',
        description: 'Find teammates based on your preferred role, champion pool, and playstyle'
      },
      {
        icon: MessageCircle,
        title: 'Strategic Communication',
        description: 'Coordinate ganks, objectives, and team fights with integrated voice chat'
      },
      {
        icon: Trophy,
        title: 'Ranked Climbing',
        description: 'Team up with players at your skill level to climb from Iron to Challenger'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Set Your Role Preferences',
        description: 'Choose your main and secondary roles, plus your champion preferences for each'
      },
      {
        step: '2',
        title: 'Get Matched with Summoners',
        description: 'Our algorithm finds players who complement your team composition and skill level'
      },
      {
        step: '3',
        title: 'Conquer the Rift Together',
        description: 'Coordinate with your team to secure objectives and climb the ranked ladder'
      }
    ],
    faq: [
      {
        question: 'What is League of Legends LFG?',
        answer: 'LFG (Looking for Group) helps you find teammates for League of Legends instead of solo queue. Connect with players who share your goals and communication style.'
      },
      {
        question: 'How does role matching work?',
        answer: 'We match you based on your preferred roles, champion pool, rank, and playstyle to create balanced team compositions for ranked or normal games.'
      }
    ]
  },
  'overwatch-2': {
    id: 'overwatch-2',
    name: 'Overwatch 2',
    displayName: 'Overwatch 2',
    slug: 'overwatch-2',
    color: '#FF6B35',
    image: '/images/games/overwatch2.webp',
    hero: {
      title: 'Assemble Your Overwatch 2 Team',
      subtitle: 'Unite with heroes and push the payload to victory',
      description: 'Connect with skilled heroes across all roles. Our matching system helps you build the perfect 6-stack for competitive play.',
    },
    features: [
      {
        icon: Users,
        title: 'Hero Role Matching',
        description: 'Find Tank, Damage, and Support players who complement your hero pool'
      },
      {
        icon: MessageCircle,
        title: 'Team Coordination',
        description: 'Coordinate ultimate combos and strategies with integrated voice chat'
      },
      {
        icon: Trophy,
        title: 'Competitive Rankings',
        description: 'Team up to climb competitive ranks from Bronze to Grandmaster'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Select Your Hero Roles',
        description: 'Choose your preferred roles and main heroes for Tank, Damage, or Support'
      },
      {
        step: '2',
        title: 'Match with Heroes',
        description: 'Get paired with players who create balanced team compositions'
      },
      {
        step: '3',
        title: 'Push Together',
        description: 'Coordinate ultimate abilities and strategies to secure objectives'
      }
    ],
    faq: [
      {
        question: 'What is Overwatch 2 LFG?',
        answer: 'LFG helps you find teammates for Overwatch 2 matches. Build consistent teams instead of relying on random matchmaking.'
      },
      {
        question: 'How does hero matching work?',
        answer: 'We match you based on your preferred heroes, role flexibility, and skill rating to create balanced team compositions.'
      }
    ]
  },
  'fortnite': {
    id: 'fortnite',
    name: 'Fortnite',
    displayName: 'Fortnite',
    slug: 'fortnite',
    color: '#8B5CF6',
    image: '/images/games/fortnite.webp',
    hero: {
      title: 'Squad Up in Fortnite',
      subtitle: 'Build, battle, and claim Victory Royales together',
      description: 'Connect with builders, fighters, and strategists. Find your perfect squad for Battle Royale, Creative, or competitive play.',
    },
    features: [
      {
        icon: Users,
        title: 'Playstyle Matching',
        description: 'Find teammates who match your building skills, combat style, and game modes'
      },
      {
        icon: MessageCircle,
        title: 'Squad Communication',
        description: 'Coordinate rotations, builds, and strategies with voice chat'
      },
      {
        icon: Trophy,
        title: 'Victory Royales',
        description: 'Team up with skilled players to secure more wins and improve your stats'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Set Your Playstyle',
        description: 'Tell us if you prefer aggressive pushes, strategic rotations, or creative builds'
      },
      {
        step: '2',
        title: 'Find Your Squad',
        description: 'Get matched with players who complement your skills and game mode preferences'
      },
      {
        step: '3',
        title: 'Drop and Conquer',
        description: 'Land together, build together, and claim Victory Royales as a team'
      }
    ],
    faq: [
      {
        question: 'What is Fortnite LFG?',
        answer: 'LFG helps you find squadmates for Fortnite Battle Royale, Creative, or competitive modes instead of playing with random fills.'
      },
      {
        question: 'How does playstyle matching work?',
        answer: 'We consider your building skills, preferred landing spots, combat style, and game modes to find compatible teammates.'
      }
    ]
  },
  'pubg': {
    id: 'pubg',
    name: 'PUBG',
    displayName: 'PUBG',
    slug: 'pubg',
    color: '#FFA500',
    image: '/images/games/pubg.webp',
    hero: {
      title: 'Find Your PUBG Squad',
      subtitle: 'Team up for tactical battle royale dominance',
      description: 'Connect with strategic players who understand positioning, rotations, and tactical gameplay. Build your perfect PUBG squad.',
    },
    features: [
      {
        icon: Users,
        title: 'Tactical Team Building',
        description: 'Find players who excel at different aspects: sniping, support, assault, and strategy'
      },
      {
        icon: MessageCircle,
        title: 'Strategic Communication',
        description: 'Coordinate rotations, callouts, and tactical decisions with voice chat'
      },
      {
        icon: Trophy,
        title: 'Competitive Play',
        description: 'Team up for ranked matches and improve your squad\'s placement ratings'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Define Your Role',
        description: 'Choose your preferred playstyle: aggressive pusher, support player, sniper, or strategist'
      },
      {
        step: '2',
        title: 'Match with Squad',
        description: 'Get paired with players who complement your tactical approach and skill level'
      },
      {
        step: '3',
        title: 'Dominate the Battlegrounds',
        description: 'Execute tactical strategies and secure chicken dinners as a coordinated team'
      }
    ],
    faq: [
      {
        question: 'What is PUBG LFG?',
        answer: 'LFG helps you find tactical teammates for PUBG matches who understand strategic gameplay and communication.'
      },
      {
        question: 'How does tactical matching work?',
        answer: 'We match you based on your preferred playstyle, weapon preferences, map knowledge, and communication skills.'
      }
    ]
  },
  'cs2': {
    id: 'cs2',
    name: 'Counter-Strike 2',
    displayName: 'Counter-Strike 2',
    slug: 'cs2',
    color: '#F39C12',
    image: '/images/games/cs2.webp',
    hero: {
      title: 'Find Your CS2 Team',
      subtitle: 'Connect with tactical players and dominate competitive matches',
      description: 'Join skilled players who understand CS2 strategy, economy management, and team coordination. Build your perfect 5-stack.',
    },
    features: [
      {
        icon: Users,
        title: 'Role-Based Matching',
        description: 'Find players for specific roles: AWPer, entry fragger, support, IGL, and lurker'
      },
      {
        icon: MessageCircle,
        title: 'Tactical Communication',
        description: 'Coordinate strategies, callouts, and executions with integrated voice chat'
      },
      {
        icon: Trophy,
        title: 'Competitive Rankings',
        description: 'Team up to climb Premier rankings and improve your team rating'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Choose Your Role',
        description: 'Select your preferred role and positions you like to play on different maps'
      },
      {
        step: '2',
        title: 'Match with Players',
        description: 'Get matched with players who complement your role and have similar skill levels'
      },
      {
        step: '3',
        title: 'Execute Strategies',
        description: 'Coordinate tactics, manage economy, and execute precise strategies as a team'
      }
    ],
    faq: [
      {
        question: 'What is CS2 LFG?',
        answer: 'LFG helps you find teammates for Counter-Strike 2 competitive matches instead of solo queuing with random players.'
      },
      {
        question: 'How does role matching work?',
        answer: 'We match you based on your preferred roles, map preferences, skill level, and communication style to create balanced teams.'
      }
    ]
  },
  'rocket-league': {
    id: 'rocket-league',
    name: 'Rocket League',
    displayName: 'Rocket League',
    slug: 'rocket-league',
    color: '#E74C3C',
    image: '/images/games/rocketleague.webp',
    hero: {
      title: 'Find Your Rocket League Team',
      subtitle: 'Connect with skilled players and score amazing goals together',
      description: 'Team up with players who understand rotation, positioning, and aerial mechanics. Build your championship team.',
    },
    features: [
      {
        icon: Users,
        title: 'Playstyle Matching',
        description: 'Find teammates who complement your rotation style and mechanical skill level'
      },
      {
        icon: MessageCircle,
        title: 'Team Coordination',
        description: 'Coordinate rotations, passes, and plays with voice chat and quick chat'
      },
      {
        icon: Trophy,
        title: 'Competitive Ranks',
        description: 'Team up to climb competitive ranks from Bronze to Grand Champion'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Set Your Playstyle',
        description: 'Choose your preferred position, mechanical skills, and what game modes you enjoy'
      },
      {
        step: '2',
        title: 'Match with Teammates',
        description: 'Get paired with players who have complementary skills and similar competitive goals'
      },
      {
        step: '3',
        title: 'Score Together',
        description: 'Execute perfect rotations, amazing passes, and coordinate team plays for victory'
      }
    ],
    faq: [
      {
        question: 'What is Rocket League LFG?',
        answer: 'LFG helps you find teammates for Rocket League competitive matches who understand rotation, positioning, and team play.'
      },
      {
        question: 'How does playstyle matching work?',
        answer: 'We match you based on your mechanical skill level, preferred positions, rotation style, and competitive goals.'
      }
    ]
  }
};

// Get detailed game information based on name
function getGameDetails(gameName: string) {
  return games[gameName as keyof typeof games] || {
    id: gameName,
    name: gameName,
    displayName: gameName,
    slug: gameName,
    color: '#8B5CF6',
    image: `/images/games/${gameName}.webp`,
    hero: {
      title: `Find Your ${gameName} Team`,
      subtitle: 'Connect with skilled players and dominate together',
    },
    features: [
      {
        icon: Users,
        title: 'Smart Matching',
        description: 'Get matched with players based on your skill level and playstyle'
      },
      {
        icon: MessageCircle,
        title: 'Team Communication',
        description: 'Built-in voice chat and messaging to coordinate strategies'
      },
      {
        icon: Trophy,
        title: 'Competitive Play',
        description: 'Find teammates at your skill level to climb ranked together'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Set Your Preferences',
        description: 'Tell us your playstyle and what you\'re looking for in teammates'
      },
      {
        step: '2',
        title: 'Get Matched',
        description: 'Our algorithm finds players who complement your style'
      },
      {
        step: '3',
        title: 'Play Together',
        description: 'Join your new team and dominate the competition'
      }
    ],
    faq: [
      {
        question: `What is ${gameName} LFG?`,
        answer: `LFG helps you find teammates for ${gameName} matches instead of playing with random players.`
      }
    ]
  };
}

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  // Get detailed game information (this could be moved to database in the future)
  const gameDetails = getGameDetails(game.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/30" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
                🎮 LFG - Looking for Group
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
                {gameDetails.hero.title}
              </h1>
              <p className="text-xl mb-4 text-muted-foreground">
                {gameDetails.hero.subtitle}
              </p>

              <div className="max-w-md mx-auto sm:mx-0">
                <WaitlistForm />
                <p className="text-sm text-muted-foreground mt-4 text-center">Join the waitlist to be notified when Gamerplug launches!</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={game.image || '/placeholder.svg'}
                  alt={game.display_name}
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Gamerplug for {game.display_name}?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover features designed specifically for {game.display_name} players
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {gameDetails.features.map((feature, index) => (
              <Card key={index} className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Finding your {game.display_name} team has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {gameDetails.howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background: `linear-gradient(135deg, ${game.color || '#8B5CF6'}, ${game.color || '#8B5CF6'}dd)` }}
                >
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{game.display_name} Players Love Gamerplug</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our community is saying about finding teammates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {gameDetails.testimonials.map((testimonial, index) => (
              <Card key={index} className="gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                      style={{ backgroundColor: game.color || '#8B5CF6' }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{game.display_name} Player</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about finding {game.display_name} teammates
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {gameDetails.faq.map((item, index) => (
              <Card key={index} className="gradient-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-primary">{item.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Find Your {game.display_name} Team?</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of players who've already found their perfect teammates
            </p>
            <div className="max-w-md mx-auto">
              <WaitlistForm />
            </div>
            <p className="text-sm text-muted-foreground mt-6">Be the first to know when Gamerplug launches!</p>
          </div>
        </div>
      </section>
    </div>
  );
}