'use client'

import Script from 'next/script'
import { useEffect, useState, useRef } from 'react'

export default function LocalizedAgent({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params
      setLocale(resolvedParams.locale)
      setIsLoading(false)
    }
    loadData()
  }, [params])

  useEffect(() => {
    if (widgetRef.current && !isLoading) {
      // Wait a bit for the script to load
      const timer = setTimeout(() => {
        if (widgetRef.current) {
          // Create the custom element dynamically
          const widget = document.createElement('elevenlabs-convai')
          widget.setAttribute('agent-id', 'agent_1501kd5ergn1e5zr4345bsc9zs9k')
          widgetRef.current.appendChild(widget)
        }
      }, 100)
      
      return () => {
        clearTimeout(timer)
        if (widgetRef.current) {
          // Clean up: remove all child elements
          while (widgetRef.current.firstChild) {
            widgetRef.current.removeChild(widgetRef.current.firstChild)
          }
        }
      }
    }
  }, [isLoading])

  if (isLoading) return null

  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed@beta"
        strategy="afterInteractive"
        async
      />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div ref={widgetRef}></div>
      </div>
    </>
  )
}

