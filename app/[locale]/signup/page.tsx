'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUpWithEmail, signInWithEmail, signInWithGoogle, session, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const returnUrl = searchParams.get('returnUrl');

  // Redirect if already logged in
  useEffect(() => {
    if (session && user?.gamertag) {
      const redirectTo = returnUrl || `/en/app/profile/${user.gamertag}`;
      router.push(redirectTo);
    } else if (session) {
      router.push('/en/app');
    }
  }, [session, user, router, returnUrl]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      const result = await signUpWithEmail(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result.needsConfirmation) {
        setNeedsConfirmation(true);
        setLoading(false);
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
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

              {needsConfirmation ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/40 bg-green-500/10 text-green-500">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-white/60 mb-4">
                    We sent a confirmation link to <span className="text-white">{email}</span>
                  </p>
                  <p className="text-sm text-white/40 mb-6">
                    Click the link in your email to activate your account. Don&apos;t forget to check your spam folder!
                  </p>
                  <button
                    onClick={() => {
                      setNeedsConfirmation(false);
                      setIsSignUp(false);
                      setPassword('');
                    }}
                    className="inline-block py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 font-bold uppercase tracking-wide transition-colors"
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-2">
                    {isSignUp ? 'Join the Squad' : 'Welcome Back'}
                  </h1>
                  <p className="text-white/60 text-center mb-8">
                    {isSignUp
                      ? 'Create your account and start matching'
                      : 'Sign in to find your gaming squad'}
                  </p>

                  {/* Google Sign In */}
                  <button
                    onClick={() => signInWithGoogle()}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors mb-6"
                  >
                    <GoogleIcon />
                    <span className="font-medium">Continue with Google</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/40 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Auth Form */}
                  <form onSubmit={handleAuth}>
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

                      {/* Password Input */}
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={isSignUp ? 'Password (min 8 characters)' : 'Password'}
                          required
                          minLength={isSignUp ? 8 : undefined}
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

                      {/* Forgot Password (sign in mode only) */}
                      {!isSignUp && (
                        <div className="text-right">
                          <Link href="/en/auth/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                      )}

                      {/* Terms (sign up mode only) */}
                      {isSignUp && (
                        <p className="text-xs text-white/40 text-center">
                          By signing up, you agree to our{' '}
                          <Link href="/en/tac" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/en/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </p>
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
                            <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                          </>
                        ) : (
                          <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Toggle Sign In / Sign Up */}
                  <p className="mt-6 text-center text-white/60">
                    {isSignUp ? (
                      <>
                        Already have an account?{' '}
                        <button
                          onClick={() => { setIsSignUp(false); setError(''); }}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{' '}
                        <button
                          onClick={() => { setIsSignUp(true); setError(''); }}
                          className="text-primary hover:underline font-medium"
                        >
                          Create one
                        </button>
                      </>
                    )}
                  </p>
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

function SignupFallback() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
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

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupContent />
    </Suspense>
  );
}
