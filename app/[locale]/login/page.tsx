'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmail, signInWithMagicLink, session, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('password');

  const returnUrl = searchParams.get('returnUrl');

  // Redirect if already logged in
  useEffect(() => {
    if (session && user?.gamertag) {
      const redirectTo = returnUrl || `/en/app/profile/${user.gamertag}`;
      router.push(redirectTo);
    }
  }, [session, user, router, returnUrl]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signInWithEmail(email, password);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
    // Redirect handled by useEffect when session updates
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signInWithMagicLink(email);
    
    if (result.error) {
      setError(result.error);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />

      <div className="relative flex-1 flex flex-col overflow-hidden pt-24">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
        </div>

        <main className="relative flex-1 flex items-center justify-center px-6 py-12">
          <div className="relative max-w-md w-full">
            {/* Card Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl" />
            
            {/* Login Card */}
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

              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-white/60 text-center mb-8">
                Sign in to find your gaming squad
              </p>

              {magicLinkSent ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/40 bg-green-500/10 text-green-500">
                    <Mail size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-white/60 mb-4">
                    We sent a magic link to <span className="text-white">{email}</span>
                  </p>
                  <p className="text-sm text-white/40">
                    Don't forget to check your spam folder!
                  </p>
                  <button
                    onClick={() => setMagicLinkSent(false)}
                    className="mt-6 text-primary hover:underline text-sm"
                  >
                    Use a different email
                  </button>
                </div>
              ) : (
                <>
                  {/* Auth Mode Toggle */}
                  <div className="flex rounded-lg bg-white/5 p-1 mb-6">
                    <button
                      onClick={() => setAuthMode('password')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        authMode === 'password'
                          ? 'bg-primary text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Password
                    </button>
                    <button
                      onClick={() => setAuthMode('magic')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        authMode === 'magic'
                          ? 'bg-primary text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Magic Link
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email Form */}
                  <form onSubmit={authMode === 'password' ? handleEmailLogin : handleMagicLink}>
                    <div className="space-y-4">
                      {/* Email Input */}
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder:text-white/40 transition-colors"
                        />
                      </div>

                      {/* Password Input (only for password mode) */}
                      {authMode === 'password' && (
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
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
                      )}

                      {/* Forgot Password Link */}
                      {authMode === 'password' && (
                        <div className="text-right">
                          <Link href="/en/auth/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{authMode === 'password' ? 'Signing in...' : 'Sending link...'}</span>
                          </>
                        ) : (
                          <span>{authMode === 'password' ? 'Sign In' : 'Send Magic Link'}</span>
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

function LoginFallback() {
  return (
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
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-white/60">Loading...</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
