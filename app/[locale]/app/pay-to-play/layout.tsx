'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';

const ALLOWED_GAMERTAGS = ['abed42', 'ionp', 'TheStephanos'];

export default function PayToPlayLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { locale } = useI18n();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.gamertag || !ALLOWED_GAMERTAGS.includes(user.gamertag)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <Lock size={36} className="text-white/40" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-bold">Early Access Only</h1>
          <p className="mb-6 text-white/60">
            Pay to Play is currently in early access. Check back soon!
          </p>
          <Link
            href={`/${locale}/app`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Back to App
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
