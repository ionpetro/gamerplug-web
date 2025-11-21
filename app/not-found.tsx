import Link from "next/link"
import { cookies, headers } from "next/headers"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { I18nProvider } from "@/components/I18nProvider"
import { loadMessages } from "@/lib/i18n"
import { BackButton } from "@/components/BackButton"

const SUPPORTED_LOCALES = ["en", "es"] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
const FALLBACK_LOCALE: SupportedLocale = "en"

export default async function NotFound() {
  const locale = await detectLocale()
  const messages = await loadMessages(locale)
  const homeHref = `/${locale}`

  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Header />

        <div className="relative flex-1 flex flex-col overflow-hidden pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
            <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
          </div>

          <main className="relative flex-1 flex items-center justify-center px-6 py-24">
            <div className="relative max-w-xl w-full">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-white/10 bg-card/70 backdrop-blur-2xl p-12 md:p-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                  <AlertTriangle size={42} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                  Lost In The Lobby
                </h1>
                <p className="text-white/70 leading-relaxed mb-10">
                  We couldn&apos;t find the page you queued for. It may have rotated out of the playlist or never existed in the first place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={homeHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold tracking-wide uppercase shadow-[0_18px_45px_rgba(220,38,38,0.45)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Home size={18} />
                    Go Home
                  </Link>
                  <BackButton className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/60 bg-transparent px-6 py-3 font-semibold tracking-wide uppercase text-primary transition-all duration-200 hover:bg-primary/10 hover:border-primary">
                    <ArrowLeft size={18} />
                    Go Back
                  </BackButton>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </I18nProvider>
  )
}

async function detectLocale(): Promise<SupportedLocale> {
  const headerList = await headers()
  const fromHeaders =
    extractLocale(headerList.get("x-matched-path")) ??
    extractLocale(headerList.get("x-invoke-path")) ??
    extractLocale(headerList.get("referer"))

  if (fromHeaders) {
    return fromHeaders
  }

  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale
  }

  return FALLBACK_LOCALE
}

function extractLocale(path: string | null): SupportedLocale | null {
  if (!path) {
    return null
  }

  let pathname = path
  if (pathname.startsWith("http")) {
    try {
      pathname = new URL(pathname).pathname
    } catch {
      pathname = path
    }
  }

  const segment = pathname.split("/").filter(Boolean)[0]
  return isSupportedLocale(segment) ? segment : null
}

function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return Boolean(value && SUPPORTED_LOCALES.some((locale) => locale === value))
}

