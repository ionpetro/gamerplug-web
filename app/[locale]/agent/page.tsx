'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function LocalizedAgent({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params
      setLocale(resolvedParams.locale)
      setIsLoading(false)
    }
    loadData()
  }, [params])

  if (isLoading) return null

  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed@beta"
        strategy="afterInteractive"
        async
      />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <elevenlabs-convai agent-id="agent_1501kd5ergn1e5zr4345bsc9zs9k"></elevenlabs-convai>
      </div>
    </>
  )
}

