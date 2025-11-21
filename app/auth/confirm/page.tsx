'use client';

import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const code = urlParams.get('code');
      const error = urlParams.get('error') || hashParams.get('error');
      const error_description = urlParams.get('error_description') || hashParams.get('error_description');
      const access_token = hashParams.get('access_token');

      // Check for errors
      if (error) {
        setStatus('error');
        const decodedDescription = error_description ? decodeURIComponent(error_description) : '';
        setMessage(`Authentication failed: ${error}${decodedDescription ? ` - ${decodedDescription}` : ''}`);
        return;
      }

      // Check if we already have tokens in the hash (Supabase already verified)
      if (access_token) {
        setStatus('success');
        setMessage('Email confirmed successfully! Please return to the Gamerplug mobile app to continue.');
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

      // No valid parameters
      setStatus('error');
      setMessage('Invalid confirmation link. Please request a new confirmation email.');
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
                  <p className="text-white/70 leading-relaxed mb-10">
                    {message}
                  </p>
                  <div className="text-sm text-white/50">
                    <p>Having trouble? Try opening the Gamerplug app directly from your home screen.</p>
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