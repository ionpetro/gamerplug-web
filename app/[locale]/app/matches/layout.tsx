'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { MatchesShell } from '@/components/matches/MatchesShell';

export default function MatchesLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ matchId?: string }>();

  return <MatchesShell activeMatchId={params?.matchId}>{children}</MatchesShell>;
}
