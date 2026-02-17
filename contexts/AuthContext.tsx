'use client';

import { supabase, User, TABLES } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/** Supabase: defer async work from onAuthStateChange with setTimeout to avoid deadlock. @see https://supabase.com/docs/reference/javascript/auth-onauthstatechange */
const DEFER_MS = 0;

const PROFILE_LOAD_TIMEOUT_MS = 15_000;
const PROFILE_LOAD_TIMEOUT_MESSAGE = 'Profile load timeout';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const loadUserProfile = useCallback(async (userId: string) => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(PROFILE_LOAD_TIMEOUT_MESSAGE)), PROFILE_LOAD_TIMEOUT_MS)
    );

    try {
      const fetchPromise = supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        if (error.code === 'PGRST116') {
          // No user profile found - this is normal for new users
          setUser(null);
        } else if (error.message?.includes('JWT') || error.message?.includes('session') || error.code === '401') {
          console.warn('Session invalid while loading profile:', error.message);
          await supabase.auth.signOut({ scope: 'local' });
          clearAuthState();
        } else {
          console.error('Error loading user profile:', error);
          setUser(null);
        }
      } else if (data) {
        // Check if user is soft deleted
        if (data.deleted_at) {
          console.error('User account is deleted');
          await signOut();
          return;
        }

        setUser(data as User);
      }
    } catch (err) {
      const isTimeout = err instanceof Error && err.message === PROFILE_LOAD_TIMEOUT_MESSAGE;
      if (isTimeout) {
        console.warn('Profile load timed out - session may be expired');
        await supabase.auth.signOut({ scope: 'local' });
        clearAuthState();
      } else {
        console.error('Unexpected error loading user profile:', err);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(session);

      if (!session?.user) {
        setLoading(false);
        return;
      }

      await loadUserProfile(session.user.id);
    }

    initSession();

    // Sync callback only; defer async work per Supabase docs to avoid deadlock.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (session?.user) {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else {
          const userId = session.user.id;
          setTimeout(() => {
            if (!cancelled) loadUserProfile(userId);
          }, DEFER_MS);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, clearAuthState]);

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An unexpected error occurred during login' };
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<{ error: string | null; needsConfirmation: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/en/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return { error: 'This email address is already registered. Try logging in instead.', needsConfirmation: false };
        }
        return { error: error.message, needsConfirmation: false };
      }

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        return { error: null, needsConfirmation: true };
      }

      return { error: null, needsConfirmation: false };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error: 'An unexpected error occurred during signup', needsConfirmation: false };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/en/auth/callback`,
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
      }
    } catch (error) {
      console.error('Unexpected Google sign in error:', error);
    }
  };

  const signInWithMagicLink = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/en/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected magic link error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/en/auth/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected reset password error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
    clearAuthState();
  };

  const refreshUser = async () => {
    if (!session?.user?.id) return;
    await loadUserProfile(session.user.id);
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithMagicLink,
    resetPassword,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
