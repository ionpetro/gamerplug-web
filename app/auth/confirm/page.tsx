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
    const handleAuthConfirm = async () => {
      try {
        // Parse URL fragments and query parameters
        const getUrlParams = () => {
          const params = new URLSearchParams();
          
          // First check URL query parameters
          searchParams.forEach((value, key) => {
            params.set(key, value);
          });
          
          // Then check URL hash fragments (for success case)
          if (typeof window !== 'undefined' && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            hashParams.forEach((value, key) => {
              params.set(key, value);
            });
          }
          
          return params;
        };

        const urlParams = getUrlParams();
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const code = urlParams.get('code');
        const type = urlParams.get('type');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        console.log('URL params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          code: code ? 'present' : 'missing',
          type,
          error,
          errorDescription
        });

        // Handle error cases first
        if (error) {
          setStatus('error');
          if (error === 'access_denied' && errorDescription?.includes('expired')) {
            setMessage('Email link has expired. Please request a new confirmation email.');
          } else {
            setMessage(`Authentication failed: ${errorDescription || error}`);
          }
          return;
        }

        // Handle case with code (email confirmation) FIRST
        if (code) {
          console.log('Attempting to verify OTP with code:', code);
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'email'
          });

          console.log('VerifyOtp result:', { data, error: verifyError });

          if (verifyError) {
            console.error('Email confirmation error:', verifyError);
            setStatus('error');
            setMessage('Failed to confirm your account. Please try again.');
            return;
          }

          if (data.session) {
            console.log('Session created successfully:', data.session);
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to app...');
            
            setTimeout(() => {
              window.location.href = 'gamerplug://auth-success';
              
              setTimeout(() => {
                setMessage('Please open the GamerPlug mobile app to continue.');
              }, 2000);
            }, 2000);
          } else {
            console.log('No session in verifyOtp response, but no error either');
            setStatus('error');
            setMessage('Email confirmed but session not created. Please try logging in.');
          }
          return;
        }

        // Handle case with code (email confirmation) FIRST
        if (code) {
          console.log('Attempting to verify OTP with code:', code);
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'email'
          });

          console.log('VerifyOtp result:', { data, error: verifyError });

          if (verifyError) {
            console.error('Email confirmation error:', verifyError);
            setStatus('error');
            setMessage('Failed to confirm your account. Please try again.');
            return;
          }

          if (data.session) {
            console.log('Session created successfully:', data.session);
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to app...');
            
            setTimeout(() => {
              window.location.href = 'gamerplug://auth-success';
              
              setTimeout(() => {
                setMessage('Please open the GamerPlug mobile app to continue.');
              }, 2000);
            }, 2000);
          } else {
            console.log('No session in verifyOtp response, but no error either');
            setStatus('error');
            setMessage('Email confirmed but session not created. Please try logging in.');
          }
          return;
        }

        // Handle success case - if we have no parameters at all, it might be a successful redirect
        if (!accessToken && !refreshToken && !error) {
          // Check if Supabase has automatically handled the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (session && !sessionError) {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to app...');
            
            // Redirect to mobile app after a short delay
            setTimeout(() => {
              window.location.href = 'gamerplug://auth-success';
              
              // Fallback: show instructions to open the app
              setTimeout(() => {
                setMessage('Please open the GamerPlug mobile app to continue.');
              }, 2000);
            }, 2000);
            return;
          }
          
          // If no session, treat as error
          setStatus('error');
          setMessage('Invalid confirmation link. Please try signing up again.');
          return;
        }

        // Handle case with tokens (OAuth flow)
        if (accessToken && refreshToken) {
          // Set the session using the tokens from the URL
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            console.error('Auth confirmation error:', setSessionError);
            setStatus('error');
            setMessage('Failed to confirm your account. Please try again.');
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to app...');
            
            // Redirect to mobile app after a short delay
            setTimeout(() => {
              window.location.href = 'gamerplug://auth-success';
              
              // Fallback: show instructions to open the app
              setTimeout(() => {
                setMessage('Please open the GamerPlug mobile app to continue.');
              }, 2000);
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid confirmation link. Please try signing up again.');
        }
      } catch (error) {
        console.error('Unexpected error during auth confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthConfirm();
  }, [searchParams]);

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