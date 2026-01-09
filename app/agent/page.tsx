'use client'

import { useConversation } from '@elevenlabs/react'
import { useEffect, useState, useMemo, useRef } from 'react'
import { Orb, type AgentState } from '@/components/ui/orb'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, PhoneOff, Phone } from 'lucide-react'

export default function AgentPage() {
  const [micPermissionGranted, setMicPermissionGranted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [micMuted, setMicMuted] = useState(false)
  
  // Dynamic colors ref for Orb - Red to Rose base (#ef4444 to #fb7185)
  const orbColorsRef = useRef<[string, string]>(['#ef4444', '#fb7185'])

  const conversation = useConversation({
    micMuted,
    volume,
  })

  const { status, isSpeaking, startSession, endSession, setVolume: setConversationVolume, getInputVolume, getOutputVolume } = conversation

  // Map conversation state to Orb agentState
  const agentState = useMemo<AgentState>(() => {
    if (status === 'connected') {
      if (isSpeaking) {
        return 'talking'
      }
      return 'listening'
    }
    if (status === 'connecting') {
      return 'thinking'
    }
    return null
  }, [status, isSpeaking])

  // Update Orb colors based on agent state - Red to Rose variations
  useEffect(() => {
    if (agentState === 'talking') {
      // Dynamic speaking state - energetic animations, brighter colors
      orbColorsRef.current = ['#ef4444', '#fb7185'] // Bright red to rose
    } else if (agentState === 'listening') {
      // Active listening state - responsive movements, base colors
      orbColorsRef.current = ['#ef4444', '#fb7185'] // Red to rose
    } else if (agentState === 'thinking') {
      // Processing state - contemplative motion, softer colors
      orbColorsRef.current = ['#dc2626', '#f87171'] // Darker red to softer rose
    } else {
      // Idle state - calm, slow-moving animations, muted colors
      orbColorsRef.current = ['#dc2626', '#f87171'] // Muted red to rose
    }
  }, [agentState])

  // Request microphone permission on mount
  useEffect(() => {
    async function requestMicPermission() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setMicPermissionGranted(true)
      } catch (error) {
        console.error('Microphone permission denied:', error)
      }
    }
    requestMicPermission()
  }, [])

  // Update conversation volume when local volume state changes
  useEffect(() => {
    if (status === 'connected') {
      setConversationVolume({ volume })
    }
  }, [volume, status, setConversationVolume])

  const handleStartConversation = async () => {
    try {
      await startSession({
        agentId: 'agent_1501kd5ergn1e5zr4345bsc9zs9k',
        connectionType: 'webrtc',
      })
    } catch (error) {
      console.error('Failed to start conversation:', error)
    }
  }

  const handleEndConversation = async () => {
    try {
      await endSession()
    } catch (error) {
      console.error('Failed to end conversation:', error)
    }
  }

  const isConnected = status === 'connected'
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Orb Visualization */}
        <div className="rounded-2xl bg-black p-8 flex items-center justify-center">
          <div className="w-64 h-64">
            <Orb
              agentState={agentState}
              getInputVolume={getInputVolume}
              getOutputVolume={getOutputVolume}
              colorsRef={orbColorsRef}
              volumeMode="auto"
            />
          </div>
        </div>

        {/* Main Action Button */}
        <div className="flex flex-col items-center space-y-4">
          {/* Microphone Permission Warning */}
          {!micPermissionGranted && (
            <div className="w-full max-w-md p-4 rounded-lg bg-card border border-primary/20">
              <p className="text-sm text-foreground text-center">
                Microphone permission is required to use the agent. Please grant microphone access.
              </p>
            </div>
          )}

          {/* Action Buttons - Side by side */}
          <div className="flex items-center justify-center gap-4">
            {/* End/Start Conversation Button */}
            <Button
              onClick={isConnected ? handleEndConversation : handleStartConversation}
              disabled={!micPermissionGranted && !isConnected}
              variant={isConnected ? 'destructive' : 'secondary'}
              size={isConnected ? 'icon' : 'lg'}
              className={`${isConnected ? 'h-16 w-16 rounded-full' : 'px-8 py-3 rounded-lg'} cursor-pointer transition-all hover:scale-110 hover:brightness-110 hover:shadow-lg disabled:hover:scale-100 disabled:hover:brightness-100 disabled:cursor-not-allowed`}
            >
              {isConnected ? (
                <PhoneOff className="h-8 w-8" />
              ) : status === 'connecting' ? (
                <span className="text-lg font-bold">Calling...</span>
              ) : (
                <span className="text-lg font-bold">Talk to Billy</span>
              )}
            </Button>

            {/* Mute Toggle - Only show when connected */}
            {isConnected && (
              <Button
                onClick={() => setMicMuted(!micMuted)}
                variant={micMuted ? 'destructive' : 'outline'}
                size="icon"
                className="h-16 w-16 rounded-full cursor-pointer transition-all hover:scale-110 hover:brightness-110 hover:shadow-lg"
              >
                {micMuted ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
