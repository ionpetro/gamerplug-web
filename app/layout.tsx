import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D83F82KSGK"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            try {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D83F82KSGK');
            } catch (e) {
              // Gracefully handle private mode or localStorage restrictions
              console.warn('Google Analytics initialization failed:', e);
            }
          `}
        </Script>
      </head>
      <body className="antialiased font-sans">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
