import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Twitter } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/30" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              📞 Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
              Have questions about GamerPlug? Need support? We're here to help you connect with the gaming community.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Support Email Card */}
            <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Email Support</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Need help with your account, have a question, or want to report an issue? Send us an email and we'll get back to you as soon as possible.
                </p>
                <Link
                  href="mailto:support@gamerplug.app"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  support@gamerplug.app
                </Link>
              </CardContent>
            </Card>

            {/* Twitter Card */}
            <Card className="gradient-card border-border/50 hover:border-accent/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Twitter className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Stay updated with the latest news, features, and community highlights. Follow us on Twitter for real-time updates and gaming tips.
                </p>
                <Link
                  href="https://x.com/The_Gamer_Plug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  @The_Gamer_Plug
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Common questions about GamerPlug and how to get started
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">When will GamerPlug be available?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  GamerPlug is currently in development. Join our waitlist to be the first to know when we launch!
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">Which platforms will GamerPlug support?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  GamerPlug will be available on iOS and Android, with support for cross-platform gaming communities including PC, PlayStation, Xbox, and Nintendo Switch.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">How do I report a bug or issue?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send us an email at support@gamerplug.app with details about the issue you're experiencing, and we'll investigate it promptly.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">Can I suggest new features?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely! We love hearing from our community. Email us your feature suggestions or reach out on Twitter.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}