import type { Metadata } from "next";

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
      <body>
        {children}
      </body>
    </html>
  );
}
