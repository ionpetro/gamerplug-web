'use client';

import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Compass, Users, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const AppHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { session, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    const locale = pathname?.split('/')[1] === 'es' ? 'es' : 'en';
    window.location.href = `/${locale}`;
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const isActive = (path: string) => {
    // For profile (/en/app), only match exactly or /en/app/profile paths
    if (path === '/en/app') {
      return pathname === '/en/app' || pathname?.startsWith('/en/app/profile');
    }
    return pathname?.includes(path);
  };

  const navLinks = [
    { href: '/en/app/explore', label: 'Explore', icon: Compass },
    { href: '/en/app/matches', label: 'Matches', icon: Users },
    { href: '/en/app', label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-background/95 backdrop-blur-md border-border py-3' : 'bg-background/80 backdrop-blur-sm border-border/50 py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/en/app" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 transform group-hover:scale-110 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Gamerplug Logo"
              width={32}
              height={32}
              quality={100}
              priority
              className="rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            />
          </div>
          <span className="hidden sm:inline font-sans font-extrabold text-xl tracking-tight italic">
            GAMER<span style={{ color: '#FF0034' }}>PLUG</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {active && <span className="text-sm font-medium">{link.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        {session && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <User size={18} className="text-primary" />
              <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
                {session.user.email?.split('@')[0]}
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-white/10 shadow-xl overflow-hidden z-50">
                <Link
                  href="/en"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <Compass size={16} />
                  Back to Site
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
