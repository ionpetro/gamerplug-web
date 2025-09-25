import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { loadMessages } from "@/lib/i18n";
import { I18nProvider } from "@/components/I18nProvider";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Gamerplug",
  description: "Connect with gamers and share your gaming clips",
  icons: {
    icon: "/gamerplug.png",
    shortcut: "/gamerplug.png",
    apple: "/gamerplug.png",
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
      <div className={`${spaceMono.variable} antialiased font-space-mono`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </I18nProvider>
  );
}


