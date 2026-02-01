'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppHome() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.gamertag) {
      router.replace(`/en/app/profile/${user.gamertag}`);
    }
  }, [user, router]);

  return null;
}
