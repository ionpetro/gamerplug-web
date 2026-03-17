'use client';

import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';
import { Heart, Users } from 'lucide-react';

export default function MatchesPage() {
  const { locale } = useI18n();

  return (
    <div className="flex h-full min-h-[420px] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.05]">
          <Heart size={34} className="text-primary" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-white">Select a conversation</h2>
        <p className="mt-3 text-sm leading-6 text-white/50">
          Pick a match from the list to open the chat. New matches will appear here as soon as you connect.
        </p>
        <Link
          href={`/${locale}/app/explore`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          <Users size={16} />
          Explore Gamers
        </Link>
      </div>
    </div>
  );
}
