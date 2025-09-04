'use client';

import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Handle token-based confirmation only
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const error = urlParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      return;
    }

    if (accessToken && refreshToken) {
      // Handle token-based confirmation
      handleTokenConfirmation(accessToken, refreshToken);
    } else {
      setStatus('error');
      setMessage('Invalid confirmation link. Please request a new confirmation email.');
    }
  }, []);

  const handleTokenConfirmation = async (accessToken: string, refreshToken: string) => {
    try {
      const { data, error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (setSessionError) {
        setStatus('error');
        setMessage('Failed to confirm your account. Please try again.');
        return;
      }

      if (data.session) {
        setStatus('success');
        setMessage('Email confirmed successfully! Redirecting to app...');
        
        setTimeout(() => {
          window.location.href = 'gamerplug://auth-success';
          setTimeout(() => {
            setMessage('Please open the GamerPlug mobile app to continue.');
          }, 2000);
        }, 2000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">🎮 GamerPlug</h1>
          </div>

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-[#FF3B30] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg">Confirming your email...</p>
            </div>
          )}


          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-lg text-green-400">{message}</p>
              <div className="mt-8 p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">
                  If the app doesn't open automatically, please open the GamerPlug mobile app manually.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-lg text-red-400">{message}</p>
              <div className="mt-8">
                <button
                  onClick={() => window.location.href = 'gamerplug://login'}
                  className="bg-[#FF3B30] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF3B30]/80 transition-colors"
                >
                  Open GamerPlug App
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-white/50">
            <p>Having trouble? Try opening the GamerPlug app directly from your home screen.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function AuthConfirm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">🎮 GamerPlug</h1>
            </div>
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-[#FF3B30] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <AuthConfirmContent />
    </Suspense>
  );
}