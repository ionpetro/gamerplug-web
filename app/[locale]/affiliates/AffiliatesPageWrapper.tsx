'use client'

import { useEffect, useState } from 'react'
import { I18nProvider } from '@/components/I18nProvider'
import AffiliatesPageClient from './AffiliatesPageClient'

export default function AffiliatesPageWrapper({ params }: { params: any }) {
  const [locale, setLocale] = useState<string | null>(null)
  const [messages, setMessages] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params
      const currentLocale = resolvedParams.locale || 'en'
      setLocale(currentLocale)

      const { loadMessages } = await import('@/lib/i18n')
      const msgs = await loadMessages(currentLocale)
      setMessages(msgs)
      setIsLoading(false)
    }
    loadData()
  }, [params])

  if (isLoading) return null

  return (
    <I18nProvider locale={locale || 'en'} messages={messages}>
      <AffiliatesPageClient />
    </I18nProvider>
  )
}
