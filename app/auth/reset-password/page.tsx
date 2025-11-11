'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handlePasswordReset = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const error = searchParams.get('error');
      const error_description = searchParams.get('error_description');

      console.log('🔍 Reset password params:', {
        token_hash: token_hash ? 'YES' : 'NO',
        type,
        error
      });

      // Check for errors
      if (error) {
        setStatus('error');
        setMessage(error_description || 'An error occurred with the reset link');
        console.log('❌ Error detected:', { error, error_description });
        return;
      }

      // Verify token_hash and get session
      if (token_hash && type === 'recovery') {
        console.log('⏳ Verifying token_hash...');
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery',
          });

          console.log('🔍 VerifyOtp result:', {
            success: !error,
            hasSession: !!data?.session,
            error: error?.message
          });

          if (error) {
            console.error('❌ Error verifying token:', error);
            setStatus('error');
            setMessage(error.message || 'Invalid or expired reset link');
            return;
          }

          if (data.session) {
            const { access_token, refresh_token } = data.session;
            console.log('✅ Got tokens, redirecting to app...');

            // Redirect to mobile app with tokens
            const deepLink = `gamerplug://reset-password#access_token=${access_token}&refresh_token=${refresh_token}&type=recovery`;
            console.log('🔗 Deep link:', deepLink);

            setStatus('success');
            setMessage('Redirecting to Gamerplug app...');
            window.location.href = deepLink;

            setTimeout(() => {
              setMessage('If the app didn\'t open automatically, please open Gamerplug manually.');
            }, 2000);
          } else {
            console.error('❌ No session returned');
            setStatus('error');
            setMessage('Failed to verify reset link');
          }
        } catch (err) {
          console.error('❌ Exception:', err);
          setStatus('error');
          setMessage('An error occurred while verifying the link');
        }
        return;
      }

      // No valid parameters
      setStatus('error');
      setMessage('Invalid reset link. Please request a new password reset email.');
    };

    handlePasswordReset();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">🎮 Gamerplug</h1>
            <h2 className="text-2xl font-semibold">Password Reset</h2>
          </div>

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-[#FF3B30] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg">Processing reset link...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-lg text-green-400">{message}</p>
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">
                  Continue in the Gamerplug app to set your new password.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-lg text-red-400">{message}</p>
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">
                  Please request a new password reset link from the Gamerplug app.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ResetPassword() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
