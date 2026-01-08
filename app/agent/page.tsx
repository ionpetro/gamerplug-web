'use client'

import Script from 'next/script'

export default function AgentPage() {
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

