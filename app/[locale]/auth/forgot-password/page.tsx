'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await resetPassword(email);
    
    if (result.error) {
      setError(result.error);
    } else {
      setEmailSent(true);
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

              {emailSent ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/40 bg-green-500/10 text-green-500">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-white/60 mb-4">
                    We sent a password reset link to <span className="text-white">{email}</span>
                  </p>
                  <p className="text-sm text-white/40 mb-6">
                    Click the link in your email to reset your password. Don't forget to check your spam folder!
                  </p>
                  <Link
                    href="/en/login"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center mb-2">
                    Reset Password
                  </h1>
                  <p className="text-white/60 text-center mb-8">
                    Enter your email and we'll send you a reset link
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

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Reset Link</span>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Back to Login */}
                  <p className="mt-6 text-center">
                    <Link href="/en/login" className="inline-flex items-center gap-2 text-white/60 hover:text-white">
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
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
