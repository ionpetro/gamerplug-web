import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GamerPlug - Find Your Perfect Gaming Squad | Match with Gamers",
    template: "%s | GamerPlug"
  },
  description: "GamerPlug matches you with gamers who share your playstyle, skill level, and preferences. Find your perfect duo or squad for Valorant, Apex Legends, Fortnite & more. Connect across PC, PlayStation, Xbox & mobile.",
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
    icon: "/logo-new.ico",
    shortcut: "/logo-new.ico",
    apple: "/gamerplug.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D83F82KSGK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D83F82KSGK');
          `}
        </Script>
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
