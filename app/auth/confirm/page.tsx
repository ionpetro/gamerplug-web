'use client';

import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { AppInstallPrompt } from '@/components/AppInstallPrompt';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const code = urlParams.get('code');
      const token = urlParams.get('token'); // PKCE verification token (if Supabase redirects before verification)
      const error = urlParams.get('error') || hashParams.get('error');
      const error_description = urlParams.get('error_description') || hashParams.get('error_description');
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      const type = urlParams.get('type') || hashParams.get('type');

      // Debug logging (remove in production if needed)
      console.log('Auth confirmation params:', {
        code: code ? 'present' : 'missing',
        token: token ? 'present' : 'missing',
        error,
        error_description,
        type,
        hasAccessToken: !!access_token,
        url: window.location.href.substring(0, 100) + '...',
      });

      // Check for errors first
      if (error) {
        setStatus('error');
        const decodedDescription = error_description ? decodeURIComponent(error_description) : '';
        let errorMessage = `Authentication failed: ${error}`;
        if (decodedDescription) {
          errorMessage += ` - ${decodedDescription}`;
        }
        
        // Provide more helpful error messages
        if (error === 'access_denied') {
          if (decodedDescription?.includes('expired')) {
            errorMessage = 'This confirmation link has expired. Please request a new confirmation email from the app.';
          } else if (decodedDescription?.includes('invalid')) {
            errorMessage = 'This confirmation link is invalid. Please request a new confirmation email from the app.';
          } else {
            errorMessage = 'This confirmation link is invalid or has expired. Please request a new confirmation email from the app.';
          }
        }
        
        setMessage(errorMessage);
        return;
      }

      // Collect all query parameters to preserve in deep link
      const allParams = new URLSearchParams();
      
      // Add all query parameters
      urlParams.forEach((value, key) => {
        allParams.append(key, value);
      });
      
      // Add hash parameters if present (for implicit flow)
      if (hashParams.toString()) {
        hashParams.forEach((value, key) => {
          allParams.append(key, value);
        });
      }

      // Check if we already have tokens in the hash (Supabase already verified - implicit flow)
      if (access_token && refresh_token) {
        setStatus('success');
        setMessage('Email confirmed successfully! Opening the Gamerplug app...');
        
        // Build deep link with hash parameters (implicit flow)
        const hashParams = new URLSearchParams();
        hashParams.set('access_token', access_token);
        hashParams.set('refresh_token', refresh_token);
        if (type) hashParams.set('type', type);
        
        const deepLink = `gamerplug://auth/callback#${hashParams.toString()}`;
        
        // Attempt to redirect to app
        window.location.href = deepLink;
        
        // Show install prompt after timeout if app didn't open
        setTimeout(() => {
          setShowInstallPrompt(true);
          setMessage('Email confirmed successfully! If the app didn\'t open, download it below.');
        }, 2500);
        return;
      }

      // Handle PKCE flow with code parameter (after Supabase verification)
      // IMPORTANT: With PKCE, the web page cannot exchange the code because it doesn't have
      // the code_verifier (which is stored in the mobile app). Instead, we pass the code
      // directly to the mobile app via deep link, and the app will exchange it.
      if (code) {
        setStatus('success');
        setMessage('Email confirmed successfully! Opening the Gamerplug app...');
        
        // Build deep link with all query parameters (PKCE flow)
        // The mobile app will exchange the code using its stored code_verifier
        const deepLink = `gamerplug://auth/callback?${allParams.toString()}`;
        
        // Attempt to redirect to app
        window.location.href = deepLink;
        
        // Show install prompt after timeout if app didn't open
        setTimeout(() => {
          setShowInstallPrompt(true);
          setMessage('Email confirmed successfully! If the app didn\'t open, download it below.');
        }, 2500);
        return;
      }

      // Handle PKCE token parameter (if Supabase redirects with token parameter)
      // This happens when Supabase's verify endpoint redirects before fully verifying
      // Use verifyOtp which doesn't require code_verifier
      if (token) {
        const tokenType = type === 'signup' ? 'signup' : type === 'email' ? 'email' : 'signup';
        
        try {
          console.log('Verifying token with verifyOtp:', { token: token.substring(0, 20) + '...', type: tokenType });
          
          // Use verifyOtp to verify the token - this works without code_verifier
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: tokenType,
          });

          if (verifyError) {
            console.error('Token verification error:', verifyError);
            setStatus('error');
            setMessage(verifyError.message || 'Invalid or expired confirmation link');
            return;
          }

          if (data.session) {
            console.log('Token verified successfully, redirecting to app');
            setStatus('success');
            setMessage('Email confirmed successfully! Opening the Gamerplug app...');
            
            // Build deep link with session tokens
            const hashParams = new URLSearchParams();
            hashParams.set('access_token', data.session.access_token);
            hashParams.set('refresh_token', data.session.refresh_token);
            hashParams.set('type', tokenType);
            
            const deepLink = `gamerplug://auth/callback#${hashParams.toString()}`;
            
            // Attempt to redirect to app
            window.location.href = deepLink;
            
            // Show install prompt after timeout if app didn't open
            setTimeout(() => {
              setShowInstallPrompt(true);
              setMessage('Email confirmed successfully! If the app didn\'t open, download it below.');
            }, 2500);
          } else {
            console.error('No session returned from verifyOtp');
            setStatus('error');
            setMessage('Failed to confirm email');
          }
        } catch (err) {
          console.error('Exception during token verification:', err);
          setStatus('error');
          setMessage('An error occurred while confirming your email');
        }
        return;
      }

      // No valid parameters
      setStatus('error');
      setMessage('Invalid confirmation link. Please request a new confirmation email from the app.');
    };

    handleEmailConfirmation();
  }, []);


  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />

      <div className="relative flex-1 flex flex-col overflow-hidden pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
        </div>

        <main className="relative flex-1 flex items-center justify-center px-6 py-24">
          <div className="relative max-w-xl w-full">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-card/70 backdrop-blur-2xl p-12 md:p-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)]">

              {status === 'loading' && (
                <>
                  <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                    <Loader2 size={42} strokeWidth={1.5} className="animate-spin" />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                    Connecting...
                  </h1>
                  <p className="text-white/70 leading-relaxed">
                    Confirming your email address. Please wait...
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-green-500/40 bg-green-500/10 text-green-500 shadow-[0_0_35px_rgba(34,197,94,0.35)]">
                    <CheckCircle size={42} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                    Ready To Play
                  </h1>
                  <p className="text-white/70 leading-relaxed">
                    {message}
                  </p>
                  {showInstallPrompt && <AppInstallPrompt />}
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                    <XCircle size={42} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                    Connection Failed
                  </h1>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {message}
                  </p>
                  <div className="text-sm text-white/50 space-y-2 mb-6">
                    <p>This can happen if:</p>
                    <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                      <li>The confirmation link has expired (links expire after 1 hour)</li>
                      <li>The link was already used</li>
                      <li>Your email provider prefetched the link</li>
                    </ul>
                  </div>
                  <div className="text-sm text-white/50">
                    <p>Please request a new confirmation email from the Gamerplug app.</p>
                  </div>
                </>
              )}

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function AuthConfirm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Header />
        <div className="relative flex-1 flex flex-col overflow-hidden pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
            <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
          </div>
          <main className="relative flex-1 flex items-center justify-center px-6 py-24">
            <div className="relative max-w-xl w-full">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-white/10 bg-card/70 backdrop-blur-2xl p-12 md:p-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                  <Loader2 size={42} strokeWidth={1.5} className="animate-spin" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                  Loading...
                </h1>
                <p className="text-white/70 leading-relaxed">
                  Please wait while we load the confirmation page.
                </p>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    }>
      <AuthConfirmContent />
    </Suspense>
  );
}