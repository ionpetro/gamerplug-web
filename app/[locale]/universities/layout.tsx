import { UniversitiesLayoutClient } from "./UniversitiesLayoutClient";

export default async function UniversitiesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <UniversitiesLayoutClient locale={locale}>
      {children}
    </UniversitiesLayoutClient>
  );
}
