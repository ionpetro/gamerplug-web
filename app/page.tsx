import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, Zap, Trophy, Download, Star } from "lucide-react"
import { Footer } from "@/components/Footer"
import WaitlistForm from "@/components/WaitlistForm"

export default function GamerplugLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-red-900/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              🎮 The Future of Gaming Connections
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent leading-tight">
              Gamerplug
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-muted-foreground max-w-2xl mx-auto">
              Swipe. Match. Game Together.
            </p>
            <p className="text-lg mb-8 text-muted-foreground max-w-3xl mx-auto">
              The ultimate platform for gamers to find their perfect teammates, build lasting communities, and level up
              their gaming experience.
            </p>
            <WaitlistForm />
          </div>
        </div>

        {/* Floating Gaming Icons */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Gamepad2 className="h-8 w-8 text-primary/60" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Trophy className="h-6 w-6 text-accent/60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-700">
          <Zap className="h-7 w-7 text-primary/40" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Level Up Your Gaming</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover features designed to connect gamers and build the ultimate gaming community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI-powered algorithm matches you with gamers who share your playstyle, skill level, and gaming
                  preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Gamepad2 className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Multi-Platform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect across PC, PlayStation, Xbox, Nintendo Switch, and mobile. Find teammates regardless of your
                  platform.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Build Communities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create or join gaming communities, organize tournaments, and build lasting friendships with fellow
                  gamers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How Gamerplug Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Finding your gaming squad has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set up your gaming profile with your favorite games, skill level, and what you're looking for in
                teammates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Swipe & Match</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse through potential teammates and communities. Swipe right on profiles that interest you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Game Together</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start chatting, plan gaming sessions, and build your ultimate gaming squad for epic adventures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Gamerplug Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Gamerplug</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to cure the loneliness epidemic plaguing the gaming community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">The Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gaming has never been more popular, yet millions of players feel isolated and disconnected. 
                  Despite being part of massive online communities, many gamers struggle to find meaningful 
                  connections and lasting friendships.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gamerplug bridges the gap between solo gaming and genuine human connection. We believe that 
                  gaming is better when shared, and that the right teammates can transform not just your gameplay, 
                  but your entire gaming experience.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">The Impact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By fostering authentic relationships within the gaming community, we're not just creating better 
                  teams – we're building a support network that extends beyond the game. Together, we can make 
                  gaming a force for connection, friendship, and belonging.
                </p>
              </div>
            </div>

            <div className="relative">
              <Card className="gradient-card border-border/50 p-8">
                <CardContent className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold">Building Connections</h4>
                  <p className="text-muted-foreground">
                    Every match made is a step towards ending gaming loneliness
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-red-900/30" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Find Your Squad?</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join the gaming revolution and connect with players who share your passion
            </p>
            <WaitlistForm />
            <p className="text-sm text-muted-foreground mt-6">Free to download</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
