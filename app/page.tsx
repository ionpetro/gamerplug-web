'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [searchUsername, setSearchUsername] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      window.location.href = `/profile/${searchUsername.trim()}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4 text-white">Gamerplug Web</h1>
        <p className="text-xl mb-8 text-white/70">Connect with gamers and share your gaming clips</p>
        
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                Search for a gamer
              </label>
              <input
                id="username"
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter gamertag..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={!searchUsername.trim()}
              className="w-full bg-[#FF3B30] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#FF3B30]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Profile
            </button>
          </form>

          <div className="text-white/50 text-sm">
            <p>Try searching for existing usernames in your database</p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link 
              href="/profile" 
              className="inline-block text-white/70 hover:text-white transition-colors underline"
            >
              View static demo profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
