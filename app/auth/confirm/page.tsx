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
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const error_description = urlParams.get('error_description');

      // Check for errors
      if (error) {
        setStatus('error');
        const decodedDescription = error_description ? decodeURIComponent(error_description) : '';
        setMessage(`Authentication failed: ${error}${decodedDescription ? ` - ${decodedDescription}` : ''}`);
        return;
      }

      // Handle PKCE flow with code parameter
      if (code) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            setStatus('error');
            setMessage(exchangeError.message || 'Invalid or expired confirmation link');
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email confirmed successfully! Please return to the Gamerplug mobile app to continue.');
          } else {
            setStatus('error');
            setMessage('Failed to confirm email');
          }
        } catch (err) {
          setStatus('error');
          setMessage('An error occurred while confirming your email');
        }
        return;
      }

      // No valid code parameter
      setStatus('error');
      setMessage('Invalid confirmation link. Please request a new confirmation email.');
    };

    handleEmailConfirmation();
  }, []);


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">🎮 Gamerplug</h1>
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
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-lg text-red-400">{message}</p>
            </div>
          )}

          <div className="mt-8 text-sm text-white/50">
            <p>Having trouble? Try opening the Gamerplug app directly from your home screen.</p>
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
              <h1 className="text-4xl font-bold mb-4">🎮 Gamerplug</h1>
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