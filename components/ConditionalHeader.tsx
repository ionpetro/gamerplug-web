'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';

/**
 * Renders the main site Header only when NOT inside the /app directory.
 * The app directory has its own AppHeader, so we hide this one there to avoid double navbars.
 */
export function ConditionalHeader() {
  const pathname = usePathname();

  // Hide main Header when we're under /en/app or /es/app (app has its own AppHeader)
  const isAppRoute = pathname?.match(/^\/(en|es)\/app(\/|$)/);
  // Hide main Header on university dashboard (it has its own top bar and sidebar)
  const isUniversitiesRoute = pathname?.match(/^\/(en|es)\/universities(\/|$)/);
  if (isAppRoute || isUniversitiesRoute) {
    return null;
  }

  return <Header />;
}
