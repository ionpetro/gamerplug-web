import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games - Gamerplug",
  description: "Explore popular games on Gamerplug and find your perfect gaming teammates",
};

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}