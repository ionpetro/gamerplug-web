'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { getPlatformAssetUrl } from '@/lib/assets';

interface User {
  id: string;
  gamertag: string;
  platform?: string[];
  profile_image_url?: string;
}

interface UserGame {
  id: string;
  name: string;
  image_url?: string;
}

interface Clip {
  id: string;
  thumbnail_url?: string;
  video_url: string;
  title?: string;
}

export default function ProfilePage() {
  // Mock data - replace with actual data fetching
  const [user] = useState<User>({
    id: '1',
    gamertag: 'ProGamer123',
    platform: ['PC', 'PS5', 'Xbox'],
    profile_image_url: '/api/placeholder/100/100'
  });

  const [userGames] = useState<UserGame[]>([
    { id: '1', name: 'Apex Legends', image_url: '/api/placeholder/50/50' },
    { id: '2', name: 'Call of Duty', image_url: '/api/placeholder/50/50' },
    { id: '3', name: 'Fortnite', image_url: '/api/placeholder/50/50' }
  ]);

  const [clips] = useState<Clip[]>([
    { id: '1', thumbnail_url: '/api/placeholder/150/200', video_url: '', title: 'Epic Win' },
    { id: '2', thumbnail_url: '/api/placeholder/150/200', video_url: '', title: 'Clutch Play' },
    { id: '3', thumbnail_url: '/api/placeholder/150/200', video_url: '', title: 'Amazing Shot' },
    { id: '4', thumbnail_url: '/api/placeholder/150/200', video_url: '', title: 'Team Win' },
    { id: '5', thumbnail_url: '/api/placeholder/150/200', video_url: '', title: 'Solo Victory' },
  ]);

  const handleEditProfile = () => {
    // TODO: Implement edit profile navigation
    console.log('Edit profile clicked');
  };

  const handleShareProfile = () => {
    // TODO: Implement share functionality
    console.log('Share profile clicked');
  };

  const handleGamesPress = () => {
    // TODO: Navigate to games page
    console.log('My games clicked');
  };

  const handleSettingsPress = () => {
    // TODO: Open settings menu
    console.log('Settings clicked');
  };

  const handleClipPress = (clip: Clip) => {
    // TODO: Open video player
    console.log('Clip clicked:', clip.id);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="w-full bg-black flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-5 pt-12 lg:px-8 lg:pt-8 max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold text-white lg:text-3xl">Gamerplug</h1>
          <div className="flex-1" />
          <button 
            onClick={handleSettingsPress}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
          </button>
        </header>

        <div className="px-5 pb-6 lg:px-8 lg:pb-8 max-w-screen-xl mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-5">
            <div className="mb-4">
              <div className="relative">
                {user.profile_image_url ? (
                  <Image
                    src={user.profile_image_url}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full lg:w-32 lg:h-32"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] lg:w-32 lg:h-32 rounded-full bg-white/10 flex items-center justify-center">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
                
                {/* Edit Icon Overlay */}
                <div className="absolute bottom-0 right-0 bg-[#FF3B30] rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-medium text-white lg:text-xl mb-3 font-space-mono">
                @{user.gamertag}
              </h2>
              {user.platform && user.platform.length > 0 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {user.platform.map((platform) => {
                    const platformIconUrl = getPlatformAssetUrl(platform);
                    return (
                      <div
                        key={platform}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/90 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md lg:text-sm lg:px-4 lg:py-2"
                      >
                        {platformIconUrl && (
                          <Image
                            src={platformIconUrl}
                            alt={platform}  
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain rounded-[4px]"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        <span>{platform}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-5 lg:gap-4">
            <button
              onClick={handleEditProfile}
              className="flex-1 bg-white/10 py-2 px-3 rounded-lg text-center hover:bg-white/20 transition-colors lg:py-3"
            >
              <span className="text-sm font-medium text-white lg:text-base">Edit profile</span>
            </button>

            <button
              onClick={handleShareProfile}
              className="flex-1 bg-white/10 py-2 px-3 rounded-lg text-center hover:bg-white/20 transition-colors lg:py-3"
            >
              <span className="text-sm font-medium text-white lg:text-base">Share profile</span>
            </button>
          </div>

          {/* My Games Section */}
          <div className="mb-5">
            <button
              onClick={handleGamesPress}
              className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg mb-3 hover:bg-white/10 transition-colors lg:py-4"
            >
              <div className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" className="mr-3">
                  <path d="M6 12h4l3 9 4-9h4c1 0 2-1 2-2V7c0-1-1-2-2-2H2c-1 0-2 1-2 2v3c0 1 1 2 2 2Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-base font-semibold text-white lg:text-lg">My games</div>
                  <div className="text-sm text-white/70 lg:text-base">{userGames.length} games</div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Clips Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-white lg:text-xl lg:mb-6">My Clips</h3>
            
            {clips.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 lg:gap-4">
                {clips.map((clip) => (
                  <button
                    key={clip.id}
                    onClick={() => handleClipPress(clip)}
                    className="relative aspect-[3/4] bg-white/5 rounded overflow-hidden group hover:bg-white/10 transition-colors"
                  >
                    {clip.thumbnail_url ? (
                      <Image
                        src={clip.thumbnail_url}
                        alt={clip.title || 'Clip thumbnail'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="w-full h-32 flex flex-col items-center justify-center bg-white/5 rounded-lg border border-dashed border-white/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                </svg>
                <p className="text-base text-gray-400 mt-2">No clips yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}