'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token_hash = searchParams.get('token_hash');
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const code = searchParams.get('code');

      // Check for errors in URL
      if (errorParam) {
        setError(errorDescription || 'Invalid or expired reset link');
        setVerifying(false);
        return;
      }

      // Handle code-based flow (PKCE)
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
            setVerifying(false);
            return;
          }
          setVerified(true);
          setVerifying(false);
          return;
        } catch (err) {
          setError('Failed to verify reset link');
          setVerifying(false);
          return;
        }
      }

      // Handle token-based flow
      if ((token || token_hash) && type === 'recovery') {
        try {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token || token_hash || '',
            type: 'recovery',
          });

          if (verifyError) {
            setError(verifyError.message || 'Invalid or expired reset link');
            setVerifying(false);
            return;
          }

          if (data.session) {
            setVerified(true);
          } else {
            setError('Failed to verify reset link');
          }
        } catch (err) {
          setError('An error occurred while verifying the link');
        }
        setVerifying(false);
        return;
      }

      // Check if we already have a session from hash params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setVerified(true);
          setVerifying(false);
          return;
        }
      }

      // No valid parameters
      setError('Invalid reset link. Please request a new password reset email.');
      setVerifying(false);
    };

    verifyToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Sign out and redirect to login after a delay
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/en/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred while updating your password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />

      <div className="relative flex-1 flex flex-col overflow-hidden pt-24">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
        </div>

        <main className="relative flex-1 flex items-center justify-center px-6 py-12">
          <div className="relative max-w-md w-full">
            {/* Card Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
            
            {/* Card */}
            <div className="relative rounded-[2rem] border border-white/10 bg-card/70 backdrop-blur-2xl p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Gamerplug Logo"
                    width={40}
                    height={40}
                    className="rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  />
                  <span className="font-sans font-extrabold text-2xl tracking-tight italic">
                    GAMER<span style={{ color: '#FF0034' }}>PLUG</span>
                  </span>
                </Link>
              </div>

              {verifying ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">Verifying Reset Link</h2>
                  <p className="text-white/60">Please wait...</p>
                </div>
              ) : success ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/40 bg-green-500/10 text-green-500">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Password Updated!</h2>
                  <p className="text-white/60 mb-4">
                    Your password has been successfully reset.
                  </p>
                  <p className="text-sm text-white/40">
                    Redirecting to login...
                  </p>
                </div>
              ) : error && !verified ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary">
                    <XCircle size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Reset Failed</h2>
                  <p className="text-white/60 mb-6">{error}</p>
                  <Link
                    href="/en/auth/forgot-password"
                    className="inline-block py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 font-bold uppercase tracking-wide transition-colors"
                  >
                    Request New Link
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-2">
                    Set New Password
                  </h1>
                  <p className="text-white/60 text-center mb-8">
                    Enter your new password below
                  </p>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {/* New Password */}
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="New password (min 8 characters)"
                          required
                          minLength={8}
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder:text-white/40 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder:text-white/40 transition-colors"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <span>Update Password</span>
                        )}
                      </button>
                    </div>
                  </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Header />
        <div className="relative flex-1 flex flex-col overflow-hidden pt-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
            <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          </div>
          <main className="relative flex-1 flex items-center justify-center px-6 py-12">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-card/70 backdrop-blur-2xl p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.55)] text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold">Loading...</h2>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
