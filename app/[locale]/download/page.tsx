import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Download Gamerplug',
  description: 'Download Gamerplug for iOS and Android. Find your perfect gaming teammates and build lasting communities.',
}

const IOS_APP_URL = 'https://apps.apple.com/us/app/gamerplug/id6752116866'
const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.ionpetro.gamerplug&pcampaignid=web_share'
const FALLBACK_URL = 'https://gamerplug.app'

function detectDevice(userAgent: string): 'ios' | 'android' | 'desktop' {
  const ua = userAgent.toLowerCase()

  // iOS detection
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios'
  }

  // Android detection
  if (/android/.test(ua)) {
    return 'android'
  }

  // Desktop or unknown
  return 'desktop'
}

export default async function DownloadPage() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  const device = detectDevice(userAgent)

  // Server-side redirect based on device
  if (device === 'ios') {
    redirect(IOS_APP_URL)
  } else if (device === 'android') {
    redirect(ANDROID_APP_URL)
  } else {
    redirect(FALLBACK_URL)
  }

  // Fallback UI (only shown if redirect fails or JS disabled)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Download Gamerplug</h1>
          <p className="text-muted-foreground text-lg">
            Redirecting you to the right app store...
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you're not redirected automatically, choose your platform:
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={IOS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="gradient-accent text-white font-semibold px-8 py-[14px] whitespace-nowrap h-[50px] w-full hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Download for iOS
              </Button>
            </a>

            <a
              href={ANDROID_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="gradient-accent text-white font-semibold px-8 py-[14px] whitespace-nowrap h-[50px] w-full hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Download for Android
              </Button>
            </a>
          </div>
          <a
            href={FALLBACK_URL}
            className="text-sm text-primary hover:underline inline-block mt-4"
          >
            Visit gamerplug.app
          </a>
        </div>
      </div>
    </div>
  )
}
