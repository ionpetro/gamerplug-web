import type { Metadata } from "next";
import "../globals.css";
import { loadMessages } from "@/lib/i18n";
import { I18nProvider } from "@/components/I18nProvider";
import { ConditionalHeader } from "@/components/ConditionalHeader";

export const metadata: Metadata = {
  title: {
    default: "GamerPlug - Find Your Perfect Gaming Squad",
    template: "%s | GamerPlug"
  },
  description: "GamerPlug matches you with gamers who share your playstyle, skill level, and preferences. Find your perfect duo or squad for Valorant, Apex Legends, Fortnite & more.",
  keywords: ["gaming", "gamers", "LFG", "looking for group", "gaming squad", "gaming teammates", "valorant lfg", "apex legends lfg", "fortnite squad", "gaming friends", "esports", "competitive gaming"],
  authors: [{ name: "GamerPlug" }],
  creator: "GamerPlug",
  publisher: "GamerPlug Inc.",
  metadataBase: new URL('https://gamerplug.app'),
  alternates: {
    canonical: '/',
    languages: {
      'x-default': 'https://gamerplug.app/en',
      'en': '/en',
      'es': '/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gamerplug.app',
    siteName: 'GamerPlug',
    title: 'GamerPlug - Find Your Perfect Gaming Squad',
    description: 'Match with gamers who share your playstyle and skill level. Connect across all platforms.',
    images: [
      {
        url: 'https://gamerplug.app/og.jpg',
        width: 1200,
        height: 630,
        alt: 'GamerPlug - Find Your Gaming Squad',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@The_Gamer_Plug',
    creator: '@The_Gamer_Plug',
    title: 'GamerPlug - Find Your Perfect Gaming Squad',
    description: 'Match with gamers who share your playstyle and skill level. Connect across all platforms.',
    images: ['https://gamerplug.app/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'es' ? 'es' : 'en';
  const messages = await loadMessages(locale);
  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="antialiased font-sans">
        <ConditionalHeader />
        {children}
      </div>
    </I18nProvider>
  );
}
