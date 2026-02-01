'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function AuthCallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);
        
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        const code = urlParams.get('code');

        // Check for errors
        if (error) {
          setStatus('error');
          setMessage(errorDescription ? decodeURIComponent(errorDescription) : error);
          return;
        }

        // Handle PKCE code exchange
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            setStatus('error');
            setMessage(exchangeError.message);
            return;
          }

          setStatus('success');
          setMessage('Successfully signed in! Redirecting...');
          
          // Redirect to app after short delay
          setTimeout(() => {
            router.push('/en/app');
          }, 1500);
          return;
        }

        // Check if we have access_token in hash (implicit flow)
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          // Session should be automatically set by Supabase
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            setStatus('success');
            setMessage('Successfully signed in! Redirecting...');
            
            setTimeout(() => {
              router.push('/en/app');
            }, 1500);
            return;
          }
        }

        // No valid auth parameters
        setStatus('error');
        setMessage('Invalid authentication callback. Please try signing in again.');
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />

      <div className="relative flex-1 flex flex-col overflow-hidden pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
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
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                    Signing In...
                  </h1>
                  <p className="text-white/70 leading-relaxed">
                    Please wait while we complete your sign in.
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-green-500/40 bg-green-500/10 text-green-500 shadow-[0_0_35px_rgba(34,197,94,0.35)]">
                    <CheckCircle size={42} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                    You're In!
                  </h1>
                  <p className="text-white/70 leading-relaxed">
                    {message}
                  </p>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                    <XCircle size={42} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                    Sign In Failed
                  </h1>
                  <p className="text-white/70 leading-relaxed mb-8">
                    {message}
                  </p>
                  <Link
                    href="/en/login"
                    className="inline-block py-3 px-8 rounded-xl bg-primary hover:bg-primary/90 font-bold uppercase tracking-wide transition-colors"
                  >
                    Try Again
                  </Link>
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

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Header />
        <div className="relative flex-1 flex flex-col overflow-hidden pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
            <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          </div>
          <main className="relative flex-1 flex items-center justify-center px-6 py-24">
            <div className="relative max-w-xl w-full">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-white/10 bg-card/70 backdrop-blur-2xl p-12 md:p-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_35px_rgba(220,38,38,0.35)]">
                  <Loader2 size={42} strokeWidth={1.5} className="animate-spin" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                  Loading...
                </h1>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
