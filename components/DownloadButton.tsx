'use client'

import { Button } from "@/components/ui/button"
import { Apple } from "lucide-react"
import { useI18n } from "@/components/I18nProvider"

export default function DownloadButton() {
  const { t } = useI18n()

  const downloadText = {
    button: t?.download?.button || "Download on iOS",
    note: t?.download?.note || "Available on the App Store"
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <a
          href="https://apps.apple.com/us/app/gamerplug/id6752116866"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button
            className="gradient-accent text-white font-semibold px-8 py-[14px] whitespace-nowrap h-[50px] w-full hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Apple className="mr-2 h-5 w-5 fill-current" />
            {downloadText.button}
          </Button>
        </a>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        {downloadText.note}
      </p>
    </div>
  )
}
