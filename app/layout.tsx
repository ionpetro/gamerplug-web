import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Gamerplug",
  description: "Connect with gamers and share your gaming clips",
  icons: {
    icon: "/gamerplug.png",
    shortcut: "/gamerplug.png",
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
      <body>
        {children}
      </body>
    </html>
  );
}
