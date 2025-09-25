import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";

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

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <div className={`${spaceMono.variable} antialiased font-space-mono`}>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}


