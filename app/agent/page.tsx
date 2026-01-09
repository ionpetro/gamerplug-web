'use client'

import { useConversation } from '@elevenlabs/react'
import { useEffect, useState, useMemo } from 'react'
import { Orb, type AgentState } from '@/components/ui/orb'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, PhoneOff, Phone } from 'lucide-react'

export default function AgentPage() {
  const [micPermissionGranted, setMicPermissionGranted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [micMuted, setMicMuted] = useState(false)

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const isConnected = status === 'connected'
  const isDisconnected = status === 'disconnected'

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
              colors={['#FF6B6B', '#DC2626']}
              volumeMode="auto"
            />
          </div>
        </div>

        {/* Main Action Button */}
        <div className="flex flex-col items-center space-y-4">
          {/* Microphone Permission Warning */}
          {!micPermissionGranted && (
            <div className="w-full max-w-md p-3 rounded-lg bg-yellow-500/10">
              <p className="text-sm text-yellow-400 text-center">
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
