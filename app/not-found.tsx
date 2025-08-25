'use client'

import { Footer } from '@/components/Footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center">
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
      <Footer />
    </div>
  )
}