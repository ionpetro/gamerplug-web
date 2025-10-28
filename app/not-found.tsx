'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/en" className="flex items-center space-x-2">
              <Image
                src="/gamerplug.png"
                alt="Gamerplug Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold" style={{ color: '#DDC1C1' }}>
                Gamerplug
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/en/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="text-8xl mb-4">🎮</div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/80 transition-colors"
              >
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>Lost? Try navigating from the home page or use the navigation menu above.</p>
          </div>
        </div>
      </div>

      <footer className="py-12 px-4 bg-card/50 border-t border-border/50">
        <div className="container mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gamerplug
            </h3>
            <p className="text-muted-foreground mb-6">Connecting gamers, building communities, creating legends.</p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <Link href="/en/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/en/tac" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/en/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6">© 2025 Gamerplug. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}