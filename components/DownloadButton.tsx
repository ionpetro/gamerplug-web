'use client'

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/I18nProvider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export default function DownloadButton() {
  const { t } = useI18n()
  const pathname = usePathname()

  const locale = useMemo(() => {
    const seg = pathname?.split("/")[1]
    return seg === "es" ? "es" : "en"
  }, [pathname])

  const hrefWithLocale = (path: string) => `/${locale}${path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`)}`

  const downloadText = {
    iosButton: t?.download?.iosButton || "Download for iOS",
    androidButton: t?.download?.androidButton || "Download for Android",
    downloadNow: t?.landing?.header?.downloadNow || "Download Now"
  }

  return (
    <div className="flex">
      {/* Mobile: Single button to /download page */}
      <Link href={hrefWithLocale("/download")} className="sm:hidden w-full">
        <Button
          className="w-full text-lg gradient-accent text-white font-sans font-extrabold tracking-tight px-8 py-[14px] whitespace-nowrap h-[60px] hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer flex justify-center items-center"
        >
          {downloadText.downloadNow}
        </Button>
      </Link>

      {/* Desktop: iOS and Android store buttons */}
      <div className="hidden sm:flex flex-row gap-4">
        <a
          href="https://apps.apple.com/us/app/gamerplug/id6752116866"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none"
        >
          <Button
            className="gradient-accent text-white font-sans font-extrabold tracking-tight px-8 py-[14px] whitespace-nowrap h-[50px] hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer flex justify-center"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="ml-2">{downloadText.iosButton}</span>
          </Button>
        </a>

        <a
          href="https://play.google.com/store/apps/details?id=com.ionpetro.gamerplug&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none relative"
        >
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase z-10">Beta</span>
          <Button
            className="gradient-accent text-white font-sans font-extrabold tracking-tight px-8 py-[14px] whitespace-nowrap h-[50px] hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer flex justify-center"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <span className="ml-2">{downloadText.androidButton}</span>
          </Button>
        </a>
      </div>
    </div>
  )
}
