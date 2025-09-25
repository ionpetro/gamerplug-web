'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { useI18n } from "@/components/I18nProvider"

export default function WaitlistForm() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Default fallback values when i18n context is not available
  const waitlistText = {
    placeholder: t?.waitlist?.placeholder || "Enter your email",
    button: t?.waitlist?.button || "Join Waitlist",
    loading: t?.waitlist?.loading || "Joining...",
    success: t?.waitlist?.success || "Joined!",
    note: t?.waitlist?.note || "Be the first to know when Gamerplug launches!"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, honeypot }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setMessage(data.message)
        setEmail('')
      } else {
        setIsSuccess(false)
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={waitlistText.placeholder}
              required
              disabled={isLoading || isSuccess}
              className="w-full px-4 py-[14px] h-[50px] rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !email.trim() || isSuccess}
            className="gradient-accent text-white font-semibold px-8 py-[14px] whitespace-nowrap h-[50px]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {waitlistText.loading}
              </div>
            ) : isSuccess ? (
              waitlistText.success
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {waitlistText.button}
              </>
            )}
          </Button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          isSuccess 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {!isSuccess && (
        <p className="text-xs text-gray-500 text-center mt-3">
          {waitlistText.note}
        </p>
      )}
    </div>
  )
}