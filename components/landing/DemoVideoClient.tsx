'use client'

import { useEffect, useState } from 'react'

export const DemoVideo = () => {
  const youtubeId = '0W88C5LfzvE'
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeId}?controls=0`
  const youtubeMobileLink = `https://youtu.be/${youtubeId}`
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateDesktop = () => setIsDesktop(mediaQuery.matches)
    updateDesktop()
    mediaQuery.addEventListener('change', updateDesktop)
    return () => mediaQuery.removeEventListener('change', updateDesktop)
  }, [])

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            Demo
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase italic">
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GamerPlug</span> in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Watch how easy it is to find your perfect gaming squad.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <a
            href={youtubeMobileLink}
            className="md:hidden block rounded-xl border border-primary/30 bg-card/70 p-8 text-center shadow-xl hover:border-primary transition-colors"
          >
            <p className="text-white text-xl font-bold mb-2">Watch Demo on YouTube</p>
            <p className="text-muted-foreground text-sm">Opens in the YouTube app when installed.</p>
          </a>
          {isDesktop ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg md:rounded-xl shadow-2xl"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
