'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Footer } from '@/components/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, user, loading } = useAuth();
  const params = useParams<{ locale?: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params?.locale === 'es' ? 'es' : params?.locale === 'ja' ? 'ja' : 'en';

  useEffect(() => {
    if (!loading && !session) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname || '/');
      router.push(`/${locale}/login?returnUrl=${returnUrl}`);
    }
  }, [locale, session, loading, router, pathname]);

  // Redirect to onboarding if user has session but no profile/gamertag
  useEffect(() => {
    if (!loading && session && !user?.gamertag && !pathname?.includes('/onboarding')) {
      router.replace(`/${locale}/app/onboarding`);
    }
  }, [locale, session, user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white/60">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col overflow-x-hidden">
      <AppHeader />
      <main className="flex-1 flex flex-col pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
